#!/usr/bin/env node

/**
 * Delete Recent Categories Script
 * 
 * This script deletes categories in the Sanity CMS that were created within the last hour
 * 
 * Usage:
 * node scripts/delete-recent-categories.js
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

async function deleteRecentCategories() {
  try {
    console.log('Fetching recently created categories...');
    
    // Calculate timestamp from 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    // Query to find categories created within the last hour
    // We're using _createdAt which is automatically added by Sanity to all documents
    const recentCategories = await client.fetch(`
      *[_type == "category" && _createdAt > $cutoffTime] {
        _id,
        title,
        _createdAt
      }
    `, { cutoffTime: oneHourAgo.toISOString() });
    
    console.log(`Found ${recentCategories.length} categories created in the last hour.`);
    
    if (recentCategories.length === 0) {
      console.log('No categories to delete.');
      return;
    }
    
    // Create a log directory if it doesn't exist
    const logDir = path.join(__dirname, 'logs');
    try {
      await mkdirAsync(logDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Delete the categories and track the results
    const deletedCategories = [];
    const failedDeletions = [];
    
    for (const category of recentCategories) {
      try {
        console.log(`Deleting category: "${category.title}" (${category._id})`);
        await client.delete(category._id);
        deletedCategories.push({
          id: category._id,
          title: category.title,
          createdAt: category._createdAt
        });
      } catch (error) {
        console.error(`Error deleting category "${category.title}":`, error.message);
        failedDeletions.push({
          id: category._id,
          title: category.title,
          error: error.message
        });
      }
    }
    
    // Write logs
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await writeFileAsync(
      path.join(logDir, `deleted-categories-${timestamp}.json`),
      JSON.stringify(deletedCategories, null, 2)
    );
    
    if (failedDeletions.length > 0) {
      await writeFileAsync(
        path.join(logDir, `failed-deletions-${timestamp}.json`),
        JSON.stringify(failedDeletions, null, 2)
      );
    }
    
    console.log('\nOperation completed!');
    console.log(`Successfully deleted: ${deletedCategories.length} categories`);
    console.log(`Failed deletions: ${failedDeletions.length}`);
    console.log(`Log files have been saved to the 'scripts/logs' directory.`);
    
  } catch (error) {
    console.error('Error during operation:', error);
    process.exit(1);
  }
}

// Execute the main function
deleteRecentCategories(); 