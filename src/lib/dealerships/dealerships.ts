import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Dealership {
  id: string;
  name: string;
  location: string;
  phone: string | null;
  website: string | null;
  slug: string;
}

// Define the structure of CSV records
interface DealershipCSVRecord {
  'Dealer Name': string;
  'Location'?: string;
  'Phone'?: string;
  'Website Address'?: string;
  [key: string]: string | undefined; // Allow for other columns
}

/**
 * Gets all dealerships from either JSON (preferred) or CSV source
 */
export async function getAllDealerships(): Promise<Dealership[]> {
  try {
    // First, try to load from JSON (faster and pre-processed)
    const jsonPath = path.join(process.cwd(), 'src/data/dealerships.json');
    
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      const dealers = JSON.parse(jsonData) as Dealership[];
      return dealers;
    }
    
    // Fall back to CSV if JSON is not available
    console.warn('Dealerships JSON not found, falling back to CSV parsing (slower)');
    return loadDealershipsFromCSV();
  } catch (error) {
    console.error('Error getting dealerships:', error);
    return [];
  }
}

/**
 * Loads dealership data directly from CSV file (slower)
 */
function loadDealershipsFromCSV(): Dealership[] {
  try {
    // Path to the CSV file
    const csvPath = path.join(process.cwd(), 'src/data/dealerships.csv');
    
    // Read the file
    const fileContents = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse the CSV
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as DealershipCSVRecord[];
    
    // Transform the data
    return records.map((record, index: number) => {
      // Create a slug from the dealer name
      const dealerName = record['Dealer Name'] || `Dealership ${index}`;
      const slug = dealerName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `dealership-${index}`;
      
      return {
        id: `dealer-${index}`,
        name: dealerName,
        location: record['Location'] || '',
        phone: record['Phone'] || null,
        website: record['Website Address'] || null,
        slug: slug,
      };
    });
  } catch (error) {
    console.error('Error reading dealerships CSV:', error);
    return [];
  }
}

export function getPaginatedDealerships(
  dealerships: Dealership[],
  page: number = 1,
  pageSize: number = 12
): {
  dealerships: Dealership[];
  totalPages: number;
  totalItems: number;
} {
  const startIndex = (page - 1) * pageSize;
  const paginatedDealerships = dealerships.slice(startIndex, startIndex + pageSize);
  
  return {
    dealerships: paginatedDealerships,
    totalPages: Math.ceil(dealerships.length / pageSize),
    totalItems: dealerships.length,
  };
}

export function searchDealerships(
  dealerships: Dealership[],
  query: string
): Dealership[] {
  if (!query) return dealerships;
  
  const searchTerm = query.toLowerCase();
  
  return dealerships.filter((dealer) => {
    return (
      dealer.name.toLowerCase().includes(searchTerm) ||
      (dealer.location && dealer.location.toLowerCase().includes(searchTerm)) ||
      (dealer.phone && dealer.phone.toLowerCase().includes(searchTerm))
    );
  });
}

export function getDealershipBySlug(
  dealerships: Dealership[],
  slug: string
): Dealership | null {
  return dealerships.find((dealer) => dealer.slug === slug) || null;
} 