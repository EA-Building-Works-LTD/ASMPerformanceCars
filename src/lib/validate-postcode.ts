/**
 * Validates a UK postcode format
 * @param postcode - The UK postcode to validate
 * @returns Boolean indicating if the postcode is valid
 */
export function validatePostcode(postcode: string): boolean {
  // UK postcode regex pattern
  const pattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  
  // Remove spaces and convert to uppercase for consistent validation
  const formattedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
  
  return pattern.test(formattedPostcode);
} 