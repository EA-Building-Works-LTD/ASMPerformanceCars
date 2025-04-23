const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
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

// Required fields that must be present in each CSV row
const REQUIRED_FIELDS = [
  'make',
  'model',
  'year',
  'price',
  'mileage',
  'fuelType',
  'transmission',
  'exteriorColor',
  'status',
];

// Fields that should be valid numbers
const NUMBER_FIELDS = [
  'year',
  'price',
  'mileage',
  'owners',
  'bhp',
  'torque',
  'engineSizeCC',
];

// Fields that should have specific values
const ENUM_FIELDS = {
  'fuelType': ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  'transmission': ['Manual', 'Automatic', 'Semi-Automatic'],
  'status': ['available', 'sold', 'reserved', 'coming soon'],
  'vehicleType': ['vehicle', 'modified_car', 'luxury_car'],
  'serviceHistory': ['Full', 'Partial', 'None'],
};

// Fields that should be boolean (TRUE/FALSE)
const BOOLEAN_FIELDS = ['isImported'];

function validateCsv(csvFilePath) {
  try {
    // Read CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(log.blue(`Found ${records.length} vehicle records to validate.`));
    
    let validRecords = 0;
    let hasErrors = false;
    
    // Validate each record
    records.forEach((row, index) => {
      let rowErrors = 0;
      console.log(log.yellow(`\nValidating row ${index + 1}: ${row.make || ''} ${row.model || ''}`));
      
      // Check required fields
      REQUIRED_FIELDS.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          console.log(log.red(`  ✗ Missing required field: ${field}`));
          rowErrors++;
        }
      });
      
      // Check number fields
      NUMBER_FIELDS.forEach(field => {
        if (row[field] && isNaN(Number(row[field]))) {
          console.log(log.red(`  ✗ Field '${field}' should be a number, got: ${row[field]}`));
          rowErrors++;
        }
      });
      
      // Check enum fields
      Object.entries(ENUM_FIELDS).forEach(([field, validValues]) => {
        if (row[field] && !validValues.some(v => v.toLowerCase() === row[field].toLowerCase())) {
          console.log(log.red(`  ✗ Field '${field}' has invalid value: ${row[field]}`));
          console.log(log.gray(`    Valid values are: ${validValues.join(', ')}`));
          rowErrors++;
        }
      });
      
      // Check boolean fields
      BOOLEAN_FIELDS.forEach(field => {
        if (row[field] && !['TRUE', 'FALSE', ''].includes(row[field])) {
          console.log(log.red(`  ✗ Field '${field}' should be TRUE or FALSE, got: ${row[field]}`));
          rowErrors++;
        }
      });
      
      // Check for reasonable year
      if (row.year && (Number(row.year) < 1900 || Number(row.year) > new Date().getFullYear() + 1)) {
        console.log(log.red(`  ✗ Year '${row.year}' is outside reasonable range (1900-${new Date().getFullYear() + 1})`));
        rowErrors++;
      }
      
      // Check for description length
      if (row.description && row.description.length < 20) {
        console.log(log.yellow(`  ⚠ Warning: Description is very short (${row.description.length} chars)`));
      }
      
      // Summary for this row
      if (rowErrors === 0) {
        console.log(log.green(`  ✓ Row ${index + 1} is valid`));
        validRecords++;
      } else {
        console.log(log.red(`  ✗ Row ${index + 1} has ${rowErrors} error(s)`));
        hasErrors = true;
      }
    });
    
    // Overall summary
    console.log('\n' + log.blue('===== Validation Summary ====='));
    console.log(`Total Records: ${records.length}`);
    console.log(`Valid Records: ${validRecords}`);
    console.log(`Invalid Records: ${records.length - validRecords}`);
    
    if (hasErrors) {
      console.log(log.red('\nPlease fix the errors before importing.'));
      return false;
    } else {
      console.log(log.green('\nAll records are valid! You can proceed with the import.'));
      return true;
    }
  } catch (error) {
    console.error(log.red('Error validating CSV:'), error);
    return false;
  }
}

// Run the validation with the CSV file path
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

// Start validation
console.log(log.blue(`Validating vehicles CSV: ${csvFilePath}...`));
const isValid = validateCsv(csvFilePath);

// Exit with appropriate code
process.exit(isValid ? 0 : 1); 