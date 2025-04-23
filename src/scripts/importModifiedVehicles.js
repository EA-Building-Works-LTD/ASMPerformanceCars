const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const cliProgress = require('cli-progress');
const chalk = require('chalk');

// Check chalk version - chalk v5+ is ESM only and requires different import
const isNewChalk = !chalk.blue;
const log = {
  blue: isNewChalk ? (msg) => console.log(msg) : chalk.blue,
  red: isNewChalk ? (msg) => console.log(msg) : chalk.red,
  green: isNewChalk ? (msg) => console.log(msg) : chalk.green,
  yellow: isNewChalk ? (msg) => console.log(msg) : chalk.yellow,
  gray: isNewChalk ? (msg) => console.log(msg) : chalk.gray
};

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You need a write token
  useCdn: false,
});

// Extract meaningful features from the vehicle description
function extractFeatures(description) {
  // Common feature patterns to look for
  const featurePatterns = [
    "HPI clear", "MOT", "imported", "Remapped", "Dyno", 
    "exhaust", "radiator", "wheels", "spoiler", "lights", 
    "bonnet", "wheel", "skirts", "brakes", "service history"
  ];
  
  // Split by commas, periods and semicolons
  const segments = description
    .split(/[,.;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Find segments that match feature patterns
  const features = segments.filter(segment => 
    featurePatterns.some(pattern => 
      segment.toLowerCase().includes(pattern.toLowerCase())
    )
  );
  
  // If we didn't find enough features, extract shorter phrases
  if (features.length < 5 && description.length > 0) {
    const additionalFeatures = description
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 4 && s.length < 50); // Reasonable feature length
      
    // Add these if we don't already have them
    additionalFeatures.forEach(feature => {
      if (!features.includes(feature)) {
        features.push(feature);
      }
    });
  }
  
  return features;
}

// Check if this is a modified vehicle based on multiple column values
function isModifiedVehicle(row) {
  // Check both vehicleType and category columns
  if (row.vehicleType && row.vehicleType.toLowerCase().includes('modified')) {
    return true;
  }
  
  if (row.category && row.category.toLowerCase().includes('modified')) {
    return true;
  }
  
  // If it has a high power value, likely a modified car
  if (row.bhp && parseInt(row.bhp) > 300) {
    return true;
  }
  
  // Check description for hints of modifications
  if (row.description && 
      (row.description.toLowerCase().includes('modified') || 
       row.description.toLowerCase().includes('tuned') ||
       row.description.toLowerCase().includes('remap') ||
       row.description.toLowerCase().includes('stage'))) {
    return true;
  }
  
  return false;
}

// Convert CSV row to Sanity document
function mapCsvRowToSanityDoc(row, index) {
  // Generate a slug from make, model and year
  const slugBase = `${row.year}-${row.make}-${row.model}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const slug = `${slugBase}-${index}`;

  // Parse features from description
  const features = extractFeatures(row.description);

  // Map price display to actual price
  const price = parseInt(row.price);
  const isPriceOnApplication = row.priceDisplay === 'POA';

  // Convert status to match expected values
  let status = 'available';
  if (row.status) {
    if (row.status.toLowerCase().includes('sold')) status = 'sold';
    else if (row.status.toLowerCase().includes('reserved')) status = 'reserved';
    else if (row.status.toLowerCase().includes('coming')) status = 'coming-soon';
  }

  // Check if this is a modified vehicle
  const isModified = isModifiedVehicle(row);
  
  // Override the document type based on our check
  const docType = isModified ? 'modifiedVehicle' : 'vehicle';
  
  console.log(`Vehicle ${row.make} ${row.model} identified as: ${isModified ? 'MODIFIED' : 'STANDARD'} vehicle`);

  // Create base vehicle document
  const baseDoc = {
    _type: docType,
    title: `${row.make} ${row.model}`,
    extendedInfo: row.year,
    highlightedSpec: row.bhp ? `${row.bhp} BHP | ${row.condition} Condition | ${row.isImported === 'TRUE' ? 'Imported' : ''}`.trim() : undefined,
    slug: {
      _type: 'slug',
      current: slug
    },
    price: price,
    priceOnApplication: isPriceOnApplication,
    mileage: parseInt(row.mileage),
    year: parseInt(row.year),
    make: row.make,
    model: row.model,
    fuelType: row.fuelType ? row.fuelType.toLowerCase() : (row.fuel_type ? row.fuel_type.toLowerCase() : 'petrol'),
    transmission: row.transmission.toLowerCase(),
    engineSize: row.engineSizeCC ? `${(parseInt(row.engineSizeCC) / 1000).toFixed(1)}` : 
               (row.engine_size ? row.engine_size.toString() : undefined),
    color: row.exteriorColor || row.exterior_color,
    features: features,
    badges: ["Imported", "Modified"].filter(badge => 
      (badge === "Imported" && row.isImported === 'TRUE') || 
      (badge === "Modified" && isModified)
    ),
    description: [
      {
        _type: 'block',
        _key: `desc${index}`,
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span${index}`,
            text: row.description,
            marks: []
          }
        ]
      }
    ],
    status: status,
    specifications: {
      vehicle: {
        make: row.make,
        model: row.model,
        year: parseInt(row.year),
        transmission: row.transmission.toLowerCase(),
        fuelType: row.fuelType ? row.fuelType.toLowerCase() : (row.fuel_type ? row.fuel_type.toLowerCase() : 'petrol'),
        engineSize: row.engineSizeCC ? `${(parseInt(row.engineSizeCC) / 1000).toFixed(1)}` : 
                  (row.engine_size ? row.engine_size.toString() : undefined),
        color: row.exteriorColor || row.exterior_color,
        status: status
      },
      history: {
        mileage: parseInt(row.mileage),
        owners: parseInt(row.owners) || 0,
        serviceHistory: row.serviceHistory ? row.serviceHistory.toLowerCase() : 'none'
      },
      performance: {
        power: row.bhp ? parseInt(row.bhp) : (row.power ? parseInt(row.power) : undefined),
        torque: row.torque ? parseInt(row.torque) : undefined
      }
    },
    // Add registration if available (for internal use)
    registration: row.registration,
    // Add a timestamp
    publishedAt: new Date().toISOString()
  };

  // Add modified vehicle specific fields if it's a modified vehicle
  if (isModified) {
    return {
      ...baseDoc,
      _type: 'modifiedVehicle',
      currentPower: row.bhp ? parseInt(row.bhp) : (row.power ? parseInt(row.power) : 0),
      originalPower: row.bhp ? Math.round(parseInt(row.bhp) * 0.8) : 
                    (row.power ? Math.round(parseInt(row.power) * 0.8) : 0),
      stage: 'stage-2', // Assume stage 2 for modified cars
      vehicleHistory: {
        owners: parseInt(row.previousOwners || row.owners) || 0,
        serviceHistory: row.serviceHistory ? (row.serviceHistory.toLowerCase() === 'full' ? 'full' : 'partial') : 'none',
      }
    };
  }

  return baseDoc;
}

async function importVehicles(csvFilePath) {
  try {
    // Read CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(log.blue(`Found ${records.length} vehicles in CSV file.`));
    
    // Print the first row to debug column names
    if (records.length > 0) {
      console.log("CSV columns found:", Object.keys(records[0]));
    }

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({
      format: 'Importing vehicles |{bar}| {percentage}% | {value}/{total} vehicles',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    progressBar.start(records.length, 0);

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      
      try {
        // Map CSV row to Sanity document
        const doc = mapCsvRowToSanityDoc(row, i);
        
        // Log the document for debugging
        console.log(`\nImporting: ${doc.title} as ${doc._type}`);
        
        // Create document in Sanity
        await client.create(doc);
        
        // Update progress
        progressBar.update(i + 1);
      } catch (error) {
        console.error(`Failed to import vehicle ${row.make} ${row.model}:`, error);
      }
    }

    // Stop progress bar
    progressBar.stop();
    console.log(log.green('Import completed successfully!'));
  } catch (error) {
    console.error(log.red('Error importing vehicles:'), error);
  }
}

// Run the import function with the path to your CSV file
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error(log.red('Please provide the path to your CSV file as an argument.'));
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(log.red(`File not found: ${csvFilePath}`));
  process.exit(1);
}

// Start import
console.log(log.blue(`Importing vehicles from ${csvFilePath}...`));
importVehicles(csvFilePath); 