#!/usr/bin/env node

/**
 * Simplified WordPress to Sanity CMS Migration Script
 * 
 * This script imports WordPress XML export file to Sanity CMS with basic formatting
 * 
 * Usage:
 * node scripts/simplify-wordpress-import.js <path-to-wordpress-export.xml>
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const xml2js = require('xml2js');
const { promisify } = require('util');
const axios = require('axios');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const cliProgress = require('cli-progress');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const { JSDOM } = require('jsdom');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configure Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Initialize progress bar
const progressBar = new cliProgress.SingleBar({
  format: 'Import Progress |{bar}| {percentage}% | {value}/{total} Posts',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

// Upload an image to Sanity
async function uploadImageToSanity(imageUrl, alt = '') {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    
    // Determine file type
    let fileType = 'jpg'; // Default
    if (imageUrl.endsWith('.png')) fileType = 'png';
    if (imageUrl.endsWith('.gif')) fileType = 'gif';
    if (imageUrl.endsWith('.svg')) fileType = 'svg';
    if (imageUrl.endsWith('.webp')) fileType = 'webp';
    
    const fileName = `wordpress-import-${uuidv4()}.${fileType}`;
    
    // Upload image to Sanity
    const imageAsset = await client.assets.upload('image', buffer, {
      filename: fileName,
      contentType: `image/${fileType}`,
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
      alt: alt
    };
  } catch (error) {
    console.error(`Error uploading image ${imageUrl}:`, error.message);
    return null;
  }
}

// Simplified HTML to Portable Text conversion
function htmlToPortableText(html) {
  if (!html || html.trim() === '') {
    return [];
  }
  
  try {
    // Clean HTML of WordPress-specific elements
    const cleanHtml = html
      .replace(/<!\[CDATA\[/, '')
      .replace(/\]\]>/, '')
      .replace(/\[caption.*?\](.*?)\[\/caption\]/g, '$1')
      .replace(/\[gallery.*?\]/g, '')
      .replace(/\[.*?\]/g, '');
    
    // Create a simple DOM to parse the HTML
    const dom = new JSDOM(`<!DOCTYPE html><html><body>${cleanHtml}</body></html>`);
    const document = dom.window.document;
    
    // Result array for portable text blocks
    const blocks = [];
    
    // Extract paragraphs, headings, and other block elements
    const blockElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol');
    
    // If no block elements found, try to split by BR tags
    if (blockElements.length === 0) {
      const plainText = cleanHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
      const paragraphs = plainText.split(/\n+/).filter(p => p.trim() !== '');
      
      return paragraphs.map(p => ({
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: p.trim() }]
      }));
    }
    
    // Process each block element
    blockElements.forEach(el => {
      const nodeName = el.nodeName.toLowerCase();
      
      // Skip empty elements
      if (el.textContent.trim() === '') return;
      
      // Determine block style
      let style = 'normal';
      if (nodeName.match(/h[1-6]/)) {
        style = nodeName; // h1, h2, etc.
      } else if (nodeName === 'blockquote') {
        style = 'blockquote';
      }
      
      // Handle lists
      const listItem = null;
      const level = 1;
      
      if (nodeName === 'ul' || nodeName === 'ol') {
        const items = el.querySelectorAll('li');
        items.forEach(li => {
          blocks.push({
            _type: 'block',
            style: 'normal',
            listItem: nodeName === 'ol' ? 'number' : 'bullet',
            level: 1,
            children: processTextWithLinks(li)
          });
        });
        return; // Skip further processing for UL/OL
      }
      
      // Process text and links for this block
      blocks.push({
        _type: 'block',
        style,
        children: processTextWithLinks(el)
      });
    });
    
    // If no blocks were created, create a fallback paragraph
    if (blocks.length === 0) {
      const plainText = cleanHtml.replace(/<[^>]*>/g, '').trim();
      return [{
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: plainText }]
      }];
    }
    
    return blocks;
    
  } catch (error) {
    console.error('Error converting HTML to Portable Text:', error);
    
    // Fallback to plain text
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    return [{
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: plainText }]
    }];
  }
  
  // Helper function to process text and links within a block
  function processTextWithLinks(element) {
    const result = [];
    const markDefs = [];
    
    // Process all links first and replace them with placeholders
    const links = element.querySelectorAll('a');
    let html = element.innerHTML;
    let linkCounter = 0;
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent;
      const placeholder = `__LINK_${linkCounter}__`;
      
      markDefs.push({
        _key: `link_${linkCounter}`,
        _type: 'link',
        href
      });
      
      html = html.replace(link.outerHTML, `<span data-link="${linkCounter}">${text}</span>`);
      linkCounter++;
    });
    
    // Re-parse with the replaced links
    const fragment = JSDOM.fragment(`<div>${html}</div>`);
    processNode(fragment.firstChild);
    
    return markDefs.length > 0 ? { children: result, markDefs } : result;
    
    // Process node and its children
    function processNode(node) {
      if (node.nodeType === 3) { // Text node
        if (node.textContent.trim() !== '') {
          result.push({
            _type: 'span',
            text: node.textContent
          });
        }
        return;
      }
      
      if (node.nodeType !== 1) return; // Not an element
      
      const nodeName = node.nodeName.toLowerCase();
      const marks = [];
      
      // Handle formatting
      if (nodeName === 'strong' || nodeName === 'b') {
        marks.push('strong');
      } else if (nodeName === 'em' || nodeName === 'i') {
        marks.push('em');
      } else if (nodeName === 'code') {
        marks.push('code');
      } else if (nodeName === 'span' && node.hasAttribute('data-link')) {
        const linkIndex = node.getAttribute('data-link');
        marks.push(`link_${linkIndex}`);
      }
      
      // Handle links and formatting with marks
      if (marks.length > 0) {
        result.push({
          _type: 'span',
          text: node.textContent,
          marks
        });
      } else {
        // Process children for other elements
        for (let i = 0; i < node.childNodes.length; i++) {
          processNode(node.childNodes[i]);
        }
      }
    }
  }
}

// Create or get an author
async function getOrCreateAuthor(authorName) {
  if (!authorName) return null;
  
  // Check if author exists
  const existingAuthor = await client.fetch(
    `*[_type == "author" && name == $name][0]`,
    { name: authorName }
  );
  
  if (existingAuthor) {
    return existingAuthor._id;
  }
  
  // Create new author
  const newAuthor = await client.create({
    _type: 'author',
    name: authorName,
    slug: {
      _type: 'slug',
      current: slugify(authorName, { lower: true })
    }
  });
  
  return newAuthor._id;
}

// Extract an excerpt from HTML content
function extractExcerpt(content, maxLength = 200) {
  if (!content) return '';
  
  // Remove HTML tags
  const text = content.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Trim and limit length
  return text.trim().substring(0, maxLength) + (text.length > maxLength ? '...' : '');
}

// Function to check if a post already exists in Sanity
async function postExists(title, slug) {
  try {
    const existingPosts = await client.fetch(`
      *[_type == "post" && (title == $title || slug.current == $slug)] {
        _id,
        title,
        slug
      }
    `, { 
      title: title,
      slug: slug
    });
    
    return existingPosts.length > 0 ? existingPosts[0] : null;
  } catch (error) {
    console.error(`Error checking if post exists:`, error);
    return null;
  }
}

// Function to delete an existing post from Sanity
async function deletePost(postId) {
  try {
    await client.delete(postId);
    console.log(`Deleted existing post with ID: ${postId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return false;
  }
}

async function importWordPress(xmlFilePath) {
  try {
    console.log(`Reading WordPress export file: ${xmlFilePath}`);
    const xmlData = await readFileAsync(xmlFilePath, 'utf8');
    
    console.log('Parsing XML data...');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    
    // Extract channel data (where posts are located)
    const channel = result.rss.channel[0];
    const items = channel.item;
    
    const posts = items.filter(item => {
      const postType = item['wp:post_type'] ? item['wp:post_type'][0] : '';
      const status = item['wp:status'] ? item['wp:status'][0] : '';
      return postType === 'post' && status === 'publish';
    });
    
    console.log(`Found ${posts.length} published posts to import.`);
    
    // Create a log directory if it doesn't exist
    const logDir = path.join(__dirname, 'logs');
    try {
      await mkdirAsync(logDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Start progress bar
    progressBar.start(posts.length, 0);
    
    // Track successful and failed imports
    const successfulImports = [];
    const failedImports = [];
    const updatedPosts = [];
    
    // Process posts
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      try {
        // Extract post data
        const title = post.title ? post.title[0] : 'Untitled Post';
        
        // Extract content - WordPress export may have content in different fields
        let content = '';
        
        // Try different content fields
        if (post['content:encoded'] && post['content:encoded'][0]) {
          content = post['content:encoded'][0];
        } else if (post.content) {
          if (typeof post.content[0] === 'string') {
            content = post.content[0];
          } else if (post.content[0] && post.content[0]._) {
            content = post.content[0]._;
          }
        } else if (post.description && post.description[0]) {
          content = post.description[0];
        } else if (post['wp:post_content'] && post['wp:post_content'][0]) {
          content = post['wp:post_content'][0];
        }
        
        // Ensure we have content
        if (!content || content.trim() === '') {
          throw new Error(`No content found for post "${title}"`);
        }
        
        // Extract excerpt
        let excerpt = '';
        if (post['excerpt:encoded'] && post['excerpt:encoded'][0]) {
          excerpt = post['excerpt:encoded'][0];
        } else if (post.excerpt) {
          if (typeof post.excerpt[0] === 'string') {
            excerpt = post.excerpt[0];
          } else if (post.excerpt[0] && post.excerpt[0]._) {
            excerpt = post.excerpt[0]._;
          }
        } else if (post['wp:post_excerpt'] && post['wp:post_excerpt'][0]) {
          excerpt = post['wp:post_excerpt'][0];
        }
        
        if (!excerpt) {
          excerpt = extractExcerpt(content);
        }
        
        const pubDate = post.pubDate[0];
        const postName = post['wp:post_name'] ? post['wp:post_name'][0] : slugify(title, { lower: true });
        const creator = post['dc:creator'] ? post['dc:creator'][0] : 'Admin';
        
        console.log(`\nProcessing post: "${title}"`);
        console.log(`Content length: ${content.length} characters`);
        
        // Check if the post already exists
        const existingPost = await postExists(title, postName);
        if (existingPost) {
          console.log(`Post "${title}" already exists with ID: ${existingPost._id}`);
          
          // Delete the existing post
          const deleted = await deletePost(existingPost._id);
          if (!deleted) {
            throw new Error(`Could not delete existing post with ID: ${existingPost._id}`);
          }
          
          updatedPosts.push({
            title,
            previousId: existingPost._id,
            action: 'replaced'
          });
        }
        
        // Get or create author
        const authorId = await getOrCreateAuthor(creator);
        
        // Skip category processing
        console.log('Skipping category processing as requested');
        
        // Handle featured image (if any)
        let mainImage = null;
        if (post['wp:postmeta']) {
          for (const meta of post['wp:postmeta']) {
            if (meta['wp:meta_key'][0] === '_thumbnail_id') {
              const thumbnailId = meta['wp:meta_value'][0];
              
              // Find attachment with this ID
              const attachment = items.find(item => 
                item['wp:post_type'] && 
                item['wp:post_type'][0] === 'attachment' && 
                item['wp:post_id'][0] === thumbnailId
              );
              
              if (attachment && attachment.guid && attachment.guid[0]) {
                let imageUrl;
                let imageAlt = title;
                
                if (typeof attachment.guid[0] === 'string') {
                  imageUrl = attachment.guid[0];
                } else if (attachment.guid[0]._) {
                  imageUrl = attachment.guid[0]._;
                }
                
                if (attachment.title && attachment.title[0]) {
                  imageAlt = attachment.title[0];
                }
                
                if (imageUrl) {
                  console.log(`Found featured image: ${imageUrl}`);
                  mainImage = await uploadImageToSanity(imageUrl, imageAlt);
                }
              }
            }
          }
        }
        
        // Convert HTML content to Portable Text
        console.log(`Converting content to Portable Text...`);
        const portableTextContent = htmlToPortableText(content);
        console.log(`Created ${portableTextContent.length} blocks of content`);
        
        // Create Sanity document
        const sanityPost = {
          _type: 'post',
          title,
          slug: {
            _type: 'slug',
            current: postName || slugify(title, { lower: true })
          },
          publishedAt: new Date(pubDate).toISOString(),
          body: portableTextContent,
          excerpt: excerpt.substring(0, 200),
        };
        
        // Add author reference if available
        if (authorId) {
          sanityPost.author = {
            _type: 'reference',
            _ref: authorId
          };
        }
        
        // Add main image if available
        if (mainImage) {
          sanityPost.mainImage = mainImage;
        }
        
        // Create the post in Sanity
        console.log(`Creating post in Sanity...`);
        const createdPost = await client.create(sanityPost);
        console.log(`Successfully created post with ID: ${createdPost._id}`);
        
        successfulImports.push({
          title,
          sanityId: createdPost._id,
          bodyBlocks: portableTextContent.length
        });
        
      } catch (error) {
        console.error(`Error importing post "${post.title ? post.title[0] : 'Untitled'}":`, error.message);
        failedImports.push({
          title: post.title ? post.title[0] : 'Untitled',
          error: error.message
        });
      }
      
      // Update progress bar
      progressBar.update(i + 1);
    }
    
    progressBar.stop();
    
    // Write logs
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await writeFileAsync(
      path.join(logDir, `successful-imports-${timestamp}.json`),
      JSON.stringify(successfulImports, null, 2)
    );
    
    await writeFileAsync(
      path.join(logDir, `failed-imports-${timestamp}.json`),
      JSON.stringify(failedImports, null, 2)
    );
    
    if (updatedPosts.length > 0) {
      await writeFileAsync(
        path.join(logDir, `updated-posts-${timestamp}.json`),
        JSON.stringify(updatedPosts, null, 2)
      );
    }
    
    console.log('\nImport completed!');
    console.log(`Successfully imported: ${successfulImports.length} posts`);
    console.log(`Posts replaced: ${updatedPosts.length} posts`);
    console.log(`Failed imports: ${failedImports.length} posts`);
    console.log(`Log files have been saved to the 'scripts/logs' directory.`);
    
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide the path to your WordPress export XML file.');
  console.error('Usage: node scripts/simplify-wordpress-import.js <path-to-wordpress-export.xml>');
  process.exit(1);
}

const xmlFilePath = args[0];
importWordPress(xmlFilePath); 