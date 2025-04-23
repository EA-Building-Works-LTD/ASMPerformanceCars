#!/usr/bin/env node

/**
 * WordPress to Sanity CMS Migration Script
 * 
 * This script imports WordPress XML export file to Sanity CMS
 * 
 * Usage:
 * node scripts/wordpress-import.js <path-to-wordpress-export.xml>
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const xml2js = require('xml2js');
const { promisify } = require('util');
const axios = require('axios');
const slugify = require('slugify');
const hljs = require('highlight.js');
const turndown = require('turndown');
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
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-03-01',
  token: process.env.SANITY_API_TOKEN, // You need a write token
  useCdn: false,
});

// Configure TurndownService for HTML to Markdown conversion
const turndownService = new turndown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Preserve HTML in the markdown to handle links properly
turndownService.keep(['a']);

// Add support for code highlighting
turndownService.addRule('pre', {
  filter: ['pre'],
  replacement: function(content, node) {
    const language = node.getAttribute('class') 
      ? node.getAttribute('class').replace('language-', '')
      : '';
    return `\`\`\`${language}\n${content}\n\`\`\``;
  }
});

// Handle strong/bold text
turndownService.addRule('strong', {
  filter: ['strong', 'b'],
  replacement: function(content) {
    return `**${content}**`;
  }
});

// Handle emphasis/italic text
turndownService.addRule('emphasis', {
  filter: ['em', 'i'],
  replacement: function(content) {
    return `*${content}*`;
  }
});

// Add custom rule for links to handle them properly
turndownService.addRule('link', {
  filter: ['a'],
  replacement: function(content, node) {
    // Instead of converting to markdown link, we'll use a special format
    // that we can detect later when converting to Portable Text
    const href = node.getAttribute('href');
    return `__CUSTOM_LINK_START__${href}__CUSTOM_LINK_CONTENT__${content}__CUSTOM_LINK_END__`;
  }
});

// Initialize progress bars
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

// Convert HTML content to Portable Text
async function htmlToPortableText(html, postTitle) {
  if (!html) return [];
  
  // Log the original HTML for debugging
  console.log(`Processing content for "${postTitle}" (${html.length} characters)`);
  
  try {
    // WordPress typically wraps content in CDATA sections
    // Remove CDATA markers if present
    let cleanHtml = html;
    if (html.includes('<![CDATA[')) {
      cleanHtml = html.replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '');
    }
    
    // Handle WordPress specific content
    // Replace WordPress shortcodes with appropriate HTML or remove them
    cleanHtml = cleanHtml
      .replace(/\[caption.*?\](.*?)\[\/caption\]/g, '$1') // Remove caption shortcodes but keep content
      .replace(/\[gallery.*?\]/g, '') // Remove gallery shortcodes
      .replace(/\[.*?\]/g, ''); // Remove any other shortcodes
    
    console.log(`Content after cleaning shortcodes (first 200 chars): ${cleanHtml.substring(0, 200).replace(/\n/g, ' ')}...`);
    
    // If the content might be plain text with some HTML tags (common in WordPress)
    // Let's add some basic structure to ensure it gets parsed correctly
    if (!cleanHtml.includes('<body') && !cleanHtml.includes('<html')) {
      cleanHtml = `<!DOCTYPE html><html><body>${cleanHtml}</body></html>`;
    }
    
    console.log("Converting HTML to document...");
    
    // Parse the HTML to create a DOM document
    const dom = new JSDOM(cleanHtml);
    const doc = dom.window.document;
    
    // Process the document to extract blocks
    const portableTextBlocks = [];
    
    // Get all elements that should be their own blocks
    const blockElements = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, div');
    
    console.log(`Found ${blockElements.length} block-level elements`);
    
    // If no block elements were found, let's try working with the raw HTML
    if (blockElements.length === 0) {
      console.log("No block elements found, treating as raw content");
      
      // Split content by <br> tags or newlines
      const paragraphs = cleanHtml
        .replace(/<br\s*\/?>/gi, '\n')
        .split(/\n+/)
        .filter(p => p.trim().length > 0);
      
      for (const paragraph of paragraphs) {
        // Create a simple paragraph block
        portableTextBlocks.push({
          _type: 'block',
          style: 'normal',
          children: [{
            _type: 'span',
            text: paragraph.replace(/<[^>]*>/g, '').trim()  // Remove HTML tags
          }]
        });
      }
      
      console.log(`Created ${portableTextBlocks.length} blocks from raw content`);
      return portableTextBlocks;
    }
    
    // Process each block element
    for (const element of blockElements) {
      const tagName = element.tagName.toLowerCase();
      
      // Skip empty blocks
      if (element.textContent.trim() === '') continue;
      
      // Determine the style based on the tag
      let style = 'normal';
      let listItem = null;
      let level = 1;
      
      if (tagName.match(/^h[1-6]$/)) {
        style = tagName;  // h1, h2, etc.
      } else if (tagName === 'blockquote') {
        style = 'blockquote';
      } else if (element.closest('ul, ol')) {
        // Check if this is inside a list
        listItem = element.closest('ol') ? 'number' : 'bullet';
        
        // Count parent lists to determine level
        let parent = element.parentElement;
        level = 1;
        while (parent) {
          if (parent.tagName === 'UL' || parent.tagName === 'OL') {
            level++;
          }
          parent = parent.parentElement;
        }
      }
      
      // Extract text and links
      const children = [];
      const markDefs = [];
      
      // Function to process text nodes and links
      function processTextNodesAndLinks(node) {
        if (node.nodeType === 3) {  // Text node
          if (node.textContent.trim() !== '') {
            children.push({
              _type: 'span',
              text: node.textContent
            });
          }
          return;
        }
        
        if (node.nodeType !== 1) return;  // Not an element
        
        // Handle links
        if (node.tagName === 'A') {
          const href = node.getAttribute('href');
          const linkText = node.textContent;
          
          if (href && linkText) {
            const key = `link_${markDefs.length}`;
            markDefs.push({
              _key: key,
              _type: 'link',
              href: href
            });
            
            children.push({
              _type: 'span',
              text: linkText,
              marks: [key]
            });
          } else {
            // If the link is malformed, just add the text
            children.push({
              _type: 'span',
              text: node.textContent
            });
          }
          return;
        }
        
        // Handle formatting
        let marks = [];
        if (node.tagName === 'STRONG' || node.tagName === 'B') {
          marks.push('strong');
        } else if (node.tagName === 'EM' || node.tagName === 'I') {
          marks.push('em');
        } else if (node.tagName === 'CODE') {
          marks.push('code');
        }
        
        // If it has marks, process as a span with marks
        if (marks.length > 0) {
          children.push({
            _type: 'span',
            text: node.textContent,
            marks: marks
          });
          return;
        }
        
        // For other elements, process their children
        for (const child of node.childNodes) {
          processTextNodesAndLinks(child);
        }
      }
      
      // Process the element's content
      for (const child of element.childNodes) {
        processTextNodesAndLinks(child);
      }
      
      // Create the block
      const block = {
        _type: 'block',
        style: style,
        ...(listItem && { listItem, level }),
        children: children,
        ...(markDefs.length > 0 && { markDefs })
      };
      
      portableTextBlocks.push(block);
    }
    
    // If we still have no blocks, fall back to using the full text content as a single block
    if (portableTextBlocks.length === 0) {
      console.log("No blocks created from DOM parsing, using full text content");
      portableTextBlocks.push({
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: doc.body.textContent.trim()
        }]
      });
    }
    
    console.log(`Created ${portableTextBlocks.length} blocks of content`);
    return portableTextBlocks;
  } catch (error) {
    console.error(`Error converting HTML to Portable Text for "${postTitle}":`, error);
    
    // Try a simple fallback approach - just split by paragraphs
    console.log("Using fallback paragraph splitting approach");
    const plainText = html
      .replace(/<[^>]*>/g, ' ')  // Remove all HTML tags
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    
    const paragraphs = plainText.split(/\n\n+/);
    const blocks = paragraphs.map(p => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: p.trim() }]
    }));
    
    return blocks.length > 0 ? blocks : [{
      _type: 'block',
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: plainText || `Content conversion error. Please check this post manually.` 
      }]
    }];
  }
}

// Helper function to parse links in text and convert to Portable Text spans
function parseLinksInText(text) {
  const children = [];
  
  // Define regex pattern to find our custom link format
  const linkPattern = /__CUSTOM_LINK_START__(.*?)__CUSTOM_LINK_CONTENT__(.*?)__CUSTOM_LINK_END__/g;
  
  let lastIndex = 0;
  let match;
  
  // Find all links in the text
  while ((match = linkPattern.exec(text)) !== null) {
    // Add text before the link as normal span
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        text: text.substring(lastIndex, match.index)
      });
    }
    
    // Add the link as a span with mark
    const url = match[1];
    const linkText = match[2];
    
    children.push({
      _type: 'span',
      text: linkText,
      marks: ['link'],
      markDefs: [{
        _type: 'link',
        _key: `link_${children.length}`,
        href: url
      }]
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      text: text.substring(lastIndex)
    });
  }
  
  // If there were no links, just return a single span
  if (children.length === 0) {
    return [{ _type: 'span', text: text }];
  }
  
  // Consolidate markDefs at the block level
  const markDefs = [];
  const processedChildren = children.map(child => {
    if (child.marks && child.marks.includes('link') && child.markDefs) {
      const markDef = child.markDefs[0];
      markDef._key = `link_${markDefs.length}`;
      markDefs.push(markDef);
      
      const newChild = { ...child };
      delete newChild.markDefs;
      return newChild;
    }
    return child;
  });
  
  // If we have markDefs, add them to each child
  if (markDefs.length > 0) {
    return { children: processedChildren, markDefs };
  }
  
  return processedChildren;
}

// Create or get a category
async function getOrCreateCategory(categoryName) {
  if (!categoryName) return null;
  
  // Check if category exists
  const existingCategory = await client.fetch(
    `*[_type == "category" && title == $title][0]`,
    { title: categoryName }
  );
  
  if (existingCategory) {
    return existingCategory._id;
  }
  
  // Create new category
  const newCategory = await client.create({
    _type: 'category',
    title: categoryName,
    slug: {
      _type: 'slug',
      current: slugify(categoryName, { lower: true })
    }
  });
  
  return newCategory._id;
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
    
    // Debug the structure of the first item to help understand the XML structure
    console.log('First item structure sample:');
    const sampleItem = items[0];
    console.log(JSON.stringify(Object.keys(sampleItem), null, 2));
    if (sampleItem['content:encoded']) {
      console.log('Content:encoded exists with length:', sampleItem['content:encoded'][0].length);
    } else {
      console.log('Content:encoded does not exist');
    }
    
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
        // Log the available fields to help diagnose the issue
        console.log(`\nPost fields available for "${title}":`);
        console.log(JSON.stringify(Object.keys(post), null, 2));
        
        let content = '';
        
        // Try multiple methods to get content
        if (post['content:encoded'] && post['content:encoded'][0]) {
          content = post['content:encoded'][0];
          console.log(`Found content in 'content:encoded' field: ${content.substring(0, 100)}...`);
        } else if (post.content) {
          if (typeof post.content[0] === 'string') {
            content = post.content[0];
            console.log(`Found content in 'content' field (string): ${content.substring(0, 100)}...`);
          } else if (post.content[0] && post.content[0]._) {
            content = post.content[0]._;
            console.log(`Found content in 'content' field (object._): ${content.substring(0, 100)}...`);
          } else if (post.content[0]) {
            console.log('Content field exists but not in expected format, dumping structure:');
            console.log(JSON.stringify(post.content[0], null, 2).substring(0, 300));
          }
        } else if (post.description && post.description[0]) {
          content = post.description[0];
          console.log(`Found content in 'description' field: ${content.substring(0, 100)}...`);
        }
        
        if (!content || content.trim() === '') {
          console.log('⚠️ WARNING: Could not extract content for post. Checking raw item:');
          const rawPost = JSON.stringify(post, null, 2);
          console.log(rawPost.substring(0, 500) + '...');
          
          // Try direct XML content access
          if (post['wp:post_content'] && post['wp:post_content'][0]) {
            content = post['wp:post_content'][0];
            console.log(`Found content in 'wp:post_content' field: ${content.substring(0, 100)}...`);
          }
          
          if (!content || content.trim() === '') {
            throw new Error('Could not extract content from post');
          }
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
        
        // Debug the first part of the content
        console.log(`Content sample: ${content.substring(0, 200).replace(/\n/g, ' ')}...`);
        
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
        
        // Note: We're skipping category processing as requested
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
        
        // Ensure content is not empty before conversion
        if (!content || content.trim() === '') {
          throw new Error('Cannot convert empty content to Portable Text');
        }
        
        // Try to use a simpler approach for conversion if HTML is not working well
        let portableTextContent = [];
        try {
          portableTextContent = await htmlToPortableText(content, title);
          console.log(`Created ${portableTextContent.length} blocks of content`);
          
          // Check if content is actually structured properly
          if (portableTextContent.length === 0) {
            throw new Error('Conversion resulted in 0 blocks');
          }
        } catch (conversionError) {
          console.error(`Error in HTML conversion: ${conversionError.message}`);
          console.log('Falling back to simple paragraph conversion...');
          
          // Simple fallback conversion - split by paragraphs
          const paragraphs = content
            .replace(/<[^>]*>/g, '') // Remove all HTML tags
            .split(/\n\n+/)           // Split by multiple newlines
            .filter(p => p.trim() !== '');
          
          portableTextContent = paragraphs.map(p => ({
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: p.trim() }]
          }));
          
          console.log(`Created ${portableTextContent.length} blocks using fallback method`);
        }
        
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
        } else {
          // Log the missing image
          console.log('No featured image found for this post');
        }
        
        // Validate the sanityPost structure before creating
        console.log('Post structure ready for import:');
        console.log(`- Title: ${sanityPost.title}`);
        console.log(`- Slug: ${sanityPost.slug.current}`);
        console.log(`- Body blocks: ${sanityPost.body.length}`);
        console.log(`- Excerpt: ${sanityPost.excerpt}`);
        
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
  console.error('Usage: node scripts/wordpress-import.js <path-to-wordpress-export.xml>');
  process.exit(1);
}

const xmlFilePath = args[0];
importWordPress(xmlFilePath); 