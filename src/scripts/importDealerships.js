const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * This script imports dealership data from a CSV file.
 * Usage: node src/scripts/importDealerships.js [path-to-csv]
 * 
 * If no file path is provided, it will use the default CSV at src/data/dealerships.csv
 */

async function importDealershipsFromCSV() {
  try {
    // Get the CSV file path from command line arguments or use default
    const csvFilePath = process.argv[2] || path.join(process.cwd(), 'src/data/dealerships.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      console.error(`Error: CSV file not found at ${csvFilePath}`);
      process.exit(1);
    }
    
    console.log(`Importing dealerships from: ${csvFilePath}`);
    
    // Read the file
    const fileContents = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse the CSV
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    console.log(`Found ${records.length} dealership records`);
    
    // Transform and validate the data
    const dealerships = records.map((record, index) => {
      // Create a slug from the dealer name
      const dealerName = record['Dealer Name'] || `Dealership ${index}`;
      const slug = dealerName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `dealership-${index}`;
      
      // Create a clean record
      return {
        id: `dealer-${index}`,
        name: dealerName,
        location: record['Location'] || '',
        phone: record['Phone'] || null,
        website: record['Website Address'] || null,
        slug: slug,
      };
    });
    
    // Save to the data directory
    const outputPath = path.join(process.cwd(), 'src/data/dealerships.json');
    fs.writeFileSync(outputPath, JSON.stringify(dealerships, null, 2));
    
    console.log(`Successfully imported and saved ${dealerships.length} dealerships to ${outputPath}`);
    
    // Output some stats
    const withWebsite = dealerships.filter(d => d.website).length;
    const withPhone = dealerships.filter(d => d.phone).length;
    
    console.log(`Stats:`);
    console.log(`- Dealerships with website: ${withWebsite} (${Math.round(withWebsite/dealerships.length * 100)}%)`);
    console.log(`- Dealerships with phone: ${withPhone} (${Math.round(withPhone/dealerships.length * 100)}%)`);
    
  } catch (error) {
    console.error('Error importing dealerships:', error);
    process.exit(1);
  }
}

importDealershipsFromCSV(); 