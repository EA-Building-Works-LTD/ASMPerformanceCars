#!/usr/bin/env node

/**
 * Remove Categories From Posts Script
 * 
 * This script removes category references from all existing posts in Sanity
 * 
 * Usage:
 * node scripts/remove-categories-from-posts.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

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

async function removeCategoriesFromPosts() {
  try {
    console.log('Fetching posts with category references...');
    
    // Query to find all posts that have categories references
    const posts = await client.fetch(`
      *[_type == "post" && defined(categories)] {
        _id,
        title
      }
    `);
    
    console.log(`Found ${posts.length} posts with category references.`);
    
    if (posts.length === 0) {
      console.log('No posts with categories to update.');
      return;
    }
    
    // Create a log directory if it doesn't exist
    const logDir = path.join(__dirname, 'logs');
    try {
      await mkdirAsync(logDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Update the posts and track the results
    const updatedPosts = [];
    const failedUpdates = [];
    
    for (const post of posts) {
      try {
        console.log(`Removing categories from post: "${post.title}" (${post._id})`);
        
        // Perform a patch operation to unset the categories field
        await client
          .patch(post._id)
          .unset(['categories'])
          .commit();
        
        updatedPosts.push({
          id: post._id,
          title: post.title
        });
      } catch (error) {
        console.error(`Error updating post "${post.title}":`, error.message);
        failedUpdates.push({
          id: post._id,
          title: post.title,
          error: error.message
        });
      }
    }
    
    // Write logs
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await writeFileAsync(
      path.join(logDir, `updated-posts-${timestamp}.json`),
      JSON.stringify(updatedPosts, null, 2)
    );
    
    if (failedUpdates.length > 0) {
      await writeFileAsync(
        path.join(logDir, `failed-updates-${timestamp}.json`),
        JSON.stringify(failedUpdates, null, 2)
      );
    }
    
    console.log('\nOperation completed!');
    console.log(`Successfully updated: ${updatedPosts.length} posts`);
    console.log(`Failed updates: ${failedUpdates.length}`);
    console.log(`Log files have been saved to the 'scripts/logs' directory.`);
    
    if (updatedPosts.length > 0) {
      console.log('\nNow you can safely run delete-recent-categories.js to remove the categories.');
    }
    
  } catch (error) {
    console.error('Error during operation:', error);
    process.exit(1);
  }
}

// Execute the main function
removeCategoriesFromPosts(); 