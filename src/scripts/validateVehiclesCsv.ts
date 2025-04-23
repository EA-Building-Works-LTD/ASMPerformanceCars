import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import chalk from 'chalk';

// Define an interface for the vehicle record
interface VehicleRecord {
  [key: string]: string | undefined; // Base property to allow any string keys with optional values
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  exteriorColor: string;
  status: string;
  owners?: string;
  bhp?: string;
  torque?: string;
  engineSizeCC?: string;
  description?: string;
  isImported?: string;
  vehicleType?: string;
  serviceHistory?: string;
}

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
const ENUM_FIELDS: Record<string, string[]> = {
  'fuelType': ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  'transmission': ['Manual', 'Automatic', 'Semi-Automatic'],
  'status': ['available', 'sold', 'reserved', 'coming soon'],
  'vehicleType': ['vehicle', 'modified_car', 'luxury_car'],
  'serviceHistory': ['Full', 'Partial', 'None'],
};

// Fields that should be boolean (TRUE/FALSE)
const BOOLEAN_FIELDS = ['isImported'];

function validateCsv(csvFilePath: string) {
  try {
    // Read CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as VehicleRecord[];

    console.log(chalk.blue(`Found ${records.length} vehicle records to validate.`));
    
    let validRecords = 0;
    let hasErrors = false;
    
    // Validate each record
    records.forEach((row: VehicleRecord, index: number) => {
      let rowErrors = 0;
      console.log(chalk.yellow(`\nValidating row ${index + 1}: ${row.make || ''} ${row.model || ''}`));
      
      // Check required fields
      REQUIRED_FIELDS.forEach(field => {
        if (!row[field] || row[field]?.trim() === '') {
          console.log(chalk.red(`  ✗ Missing required field: ${field}`));
          rowErrors++;
        }
      });
      
      // Check number fields
      NUMBER_FIELDS.forEach(field => {
        if (row[field] && isNaN(Number(row[field]))) {
          console.log(chalk.red(`  ✗ Field '${field}' should be a number, got: ${row[field]}`));
          rowErrors++;
        }
      });
      
      // Check enum fields
      Object.entries(ENUM_FIELDS).forEach(([field, validValues]) => {
        const value = row[field];
        if (value && !validValues.some(v => v.toLowerCase() === value.toLowerCase())) {
          console.log(chalk.red(`  ✗ Field '${field}' has invalid value: ${value}`));
          console.log(chalk.gray(`    Valid values are: ${validValues.join(', ')}`));
          rowErrors++;
        }
      });
      
      // Check boolean fields
      BOOLEAN_FIELDS.forEach(field => {
        const value = row[field];
        if (value && !['TRUE', 'FALSE', ''].includes(value)) {
          console.log(chalk.red(`  ✗ Field '${field}' should be TRUE or FALSE, got: ${value}`));
          rowErrors++;
        }
      });
      
      // Check for reasonable year
      if (row.year && (Number(row.year) < 1900 || Number(row.year) > new Date().getFullYear() + 1)) {
        console.log(chalk.red(`  ✗ Year '${row.year}' is outside reasonable range (1900-${new Date().getFullYear() + 1})`));
        rowErrors++;
      }
      
      // Check for description length
      if (row.description && row.description.length < 20) {
        console.log(chalk.yellow(`  ⚠ Warning: Description is very short (${row.description.length} chars)`));
      }
      
      // Summary for this row
      if (rowErrors === 0) {
        console.log(chalk.green(`  ✓ Row ${index + 1} is valid`));
        validRecords++;
      } else {
        console.log(chalk.red(`  ✗ Row ${index + 1} has ${rowErrors} error(s)`));
        hasErrors = true;
      }
    });
    
    // Overall summary
    console.log('\n' + chalk.blue('===== Validation Summary ====='));
    console.log(`Total Records: ${records.length}`);
    console.log(`Valid Records: ${validRecords}`);
    console.log(`Invalid Records: ${records.length - validRecords}`);
    
    if (hasErrors) {
      console.log(chalk.red('\nPlease fix the errors before importing.'));
      return false;
    } else {
      console.log(chalk.green('\nAll records are valid! You can proceed with the import.'));
      return true;
    }
  } catch (error) {
    console.error(chalk.red('Error validating CSV:'), error);
    return false;
  }
}

// Run the validation with the CSV file path
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error(chalk.red('Please provide the path to your CSV file as an argument.'));
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(chalk.red(`File not found: ${csvFilePath}`));
  process.exit(1);
}

// Start validation
console.log(chalk.blue(`Validating vehicles CSV: ${csvFilePath}...`));
const isValid = validateCsv(csvFilePath);

// Exit with appropriate code
process.exit(isValid ? 0 : 1); 