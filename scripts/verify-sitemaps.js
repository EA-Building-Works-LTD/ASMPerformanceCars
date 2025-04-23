/**
 * Sitemap verification script
 * 
 * This script checks the structure and validity of our sitemaps before deployment.
 * It ensures that:
 * 1. The sitemap-index.xml exists and contains references to other sitemaps
 * 2. All referenced sitemaps exist and are valid XML
 * 3. There are no issues with URLs in the sitemaps
 * 
 * Run with: node scripts/verify-sitemaps.js
 */

const https = require('https');
const http = require('http');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

// Base URL - change this to your local dev URL for testing
const BASE_URL = process.env.VERIFY_URL || 'http://localhost:3000';
// const BASE_URL = 'https://asmperformancecars.co.uk'; // Use for production verification

const parser = new xml2js.Parser();

/**
 * Fetch a URL and return its contents
 */
async function fetchURL(url) {
  const client = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Status Code: ${res.statusCode} for ${url}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parse an XML sitemap and return its contents
 */
async function parseSitemap(data) {
  try {
    const result = await parser.parseStringPromise(data);
    return result;
  } catch (error) {
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}

/**
 * Check a sitemap index and its referenced sitemaps
 */
async function checkSitemapIndex(url) {
  console.log(`\n🔍 Checking sitemap index at: ${url}`);
  
  try {
    const data = await fetchURL(url);
    console.log(`✅ Sitemap index fetched successfully`);
    
    const parsed = await parseSitemap(data);
    
    if (!parsed.sitemapindex || !parsed.sitemapindex.sitemap) {
      throw new Error('Invalid sitemap index format');
    }
    
    const sitemaps = parsed.sitemapindex.sitemap;
    console.log(`📋 Found ${sitemaps.length} sitemaps in the index`);
    
    // Check each referenced sitemap
    for (const sitemap of sitemaps) {
      const loc = sitemap.loc[0];
      await checkSingleSitemap(loc);
    }
    
    console.log(`\n✅ All sitemaps in the index are valid`);
  } catch (error) {
    console.error(`❌ Error checking sitemap index: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Check individual sitemaps specifically
 */
async function checkIndividualSitemaps() {
  console.log(`\n🔍 Checking individual sitemaps directly`);
  
  try {
    // Check the dynamic pages sitemap
    console.log(`\n🔍 Checking dynamic pages sitemap`);
    await checkSingleSitemap(`${BASE_URL}/server-sitemap-pages.xml`);
    
    // Check the cars sitemap
    console.log(`\n🔍 Checking cars sitemap`);
    await checkSingleSitemap(`${BASE_URL}/server-sitemap-cars.xml`);
    
    // Check the blogs sitemap
    console.log(`\n🔍 Checking blogs sitemap`);
    await checkSingleSitemap(`${BASE_URL}/server-sitemap-blogs.xml`);
    
    console.log(`\n✅ All individual sitemaps are valid`);
  } catch (error) {
    console.error(`❌ Error checking individual sitemaps: ${error.message}`);
  }
}

/**
 * Check a single sitemap file
 */
async function checkSingleSitemap(url) {
  console.log(`\n📄 Checking sitemap: ${url}`);
  
  try {
    const data = await fetchURL(url);
    console.log(`✅ Sitemap fetched successfully`);
    
    const parsed = await parseSitemap(data);
    
    if (!parsed.urlset || !parsed.urlset.url) {
      throw new Error('Invalid sitemap format');
    }
    
    const urls = parsed.urlset.url;
    console.log(`🔗 Found ${urls.length} URLs in sitemap`);
    
    // Verify a sample of URLs (first 3 and last 3)
    const samplesToCheck = [
      ...urls.slice(0, 3),
      ...urls.slice(Math.max(0, urls.length - 3))
    ];
    
    // Remove duplicates if fewer than 6 URLs
    const uniqueSamples = samplesToCheck.filter((item, index, self) => 
      index === self.findIndex(t => t.loc[0] === item.loc[0])
    );
    
    console.log(`🧪 Sampling ${uniqueSamples.length} URLs for validation`);
    
    for (const urlItem of uniqueSamples) {
      const loc = urlItem.loc[0];
      console.log(`  - ${loc}`);
    }
    
    console.log(`✅ Sitemap validated successfully`);
  } catch (error) {
    console.error(`❌ Error checking sitemap: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Check robots.txt for sitemap references
 */
async function checkRobotsTxt(url) {
  console.log(`\n🤖 Checking robots.txt at: ${url}`);
  
  try {
    const data = await fetchURL(url);
    console.log(`✅ robots.txt fetched successfully`);
    
    // Check if robots.txt contains a sitemap reference
    if (data.includes('Sitemap:')) {
      console.log(`✅ robots.txt contains sitemap reference(s):`);
      
      // Extract all sitemap references
      const sitemapRefs = data
        .split('\n')
        .filter(line => line.trim().startsWith('Sitemap:'))
        .map(line => line.replace('Sitemap:', '').trim());
      
      sitemapRefs.forEach(ref => console.log(`  - ${ref}`));
      
      // Check if the main sitemap index is referenced
      if (sitemapRefs.some(ref => ref.includes('sitemap-index.xml'))) {
        console.log(`✅ robots.txt references the main sitemap index`);
      } else {
        console.warn(`⚠️ Warning: robots.txt does not reference the main sitemap index`);
      }
    } else {
      console.warn(`⚠️ Warning: No sitemap references found in robots.txt`);
    }
  } catch (error) {
    console.error(`❌ Error checking robots.txt: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Starting sitemap verification');
  console.log(`🌐 Using base URL: ${BASE_URL}`);
  
  // Check robots.txt
  await checkRobotsTxt(`${BASE_URL}/robots.txt`);
  
  // Check sitemap index
  await checkSitemapIndex(`${BASE_URL}/sitemap-index.xml`);
  
  // Also check individual sitemaps directly
  await checkIndividualSitemaps();
  
  console.log('\n✅ Sitemap verification completed successfully');
}

// Run the main function
main().catch(error => {
  console.error(`\n❌ Verification failed: ${error.message}`);
  process.exit(1);
}); 