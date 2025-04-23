// Register TypeScript
require('ts-node').register({
  project: './tsconfig.json',
  transpileOnly: true
});

// Load environment variables
require('dotenv').config();

// Import Algolia client
const algoliasearch = require('algoliasearch/lite');
const fs = require('fs');
const path = require('path');

// Initialize the Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

// Get the FAQ index
const faqIndex = client.initIndex('faqs');

// Function to read and parse a FAQ data file
function readFaqData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Extract the array from the TypeScript file
    const match = content.match(/export const \w+Faqs: FAQItem\[\] = (\[[\s\S]*\]);/);
    if (match) {
      // Convert the TypeScript array to a JavaScript object
      return eval(match[1]);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Get all FAQ data files
const faqDir = path.join(process.cwd(), 'src', 'app', 'faqs');
const faqCategories = fs.readdirSync(faqDir)
  .filter(dir => dir.endsWith('-faqs') && fs.statSync(path.join(faqDir, dir)).isDirectory());

// Prepare all FAQs for indexing
const allFaqs = [];
faqCategories.forEach(category => {
  const dataFile = path.join(faqDir, category, 'data.ts');
  if (fs.existsSync(dataFile)) {
    const faqs = readFaqData(dataFile);
    // Add category information
    const categoryName = category.replace('-faqs', '').split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    faqs.forEach(faq => {
      allFaqs.push({
        ...faq,
        category: categoryName,
        categorySlug: category.replace('-faqs', ''),
        objectID: faq.id // Algolia requires objectID
      });
    });
  }
});

async function main() {
  try {
    console.log('Starting FAQ indexing...');
    
    // Configure the index settings
    await faqIndex.setSettings({
      searchableAttributes: ['question', 'answer'],
      attributesForFaceting: ['category'],
      attributesToRetrieve: ['id', 'question', 'answer', 'category', 'categorySlug']
    });
    
    // Add the FAQs to the index
    const result = await faqIndex.saveObjects(allFaqs);
    
    console.log(`Successfully indexed ${result.objectIDs.length} FAQs to Algolia`);
    process.exit(0);
  } catch (error) {
    console.error('Error indexing FAQs:', error);
    process.exit(1);
  }
}

main(); 