import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Function to fetch access token
async function getAccessToken() {
  // Get token URL from environment variables or use fallback
  const tokenUrl = process.env.DVSA_TOKEN_URL || 'https://login.microsoftonline.com/a455b827-244f-4c97-b5b4-ce5d13b4d00c/oauth2/v2.0/token';
  
  // Client credentials from environment variables
  const clientId = process.env.DVSA_CLIENT_ID;
  const clientSecret = process.env.DVSA_CLIENT_SECRET;
  const scope = process.env.DVSA_API_SCOPE || 'https://tapi.dvsa.gov.uk/.default';
  
  // Check if credentials are available
  if (!clientId || !clientSecret) {
    console.error('DVSA API credentials not found in environment variables');
    throw new Error('API credentials not configured');
  }
  
  // Prepare the POST data for the token request
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', clientId);
  formData.append('client_secret', clientSecret);
  formData.append('scope', scope);

  try {
    // Request the token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const tokenData = await response.json();

    if (tokenData.access_token) {
      return tokenData.access_token;
    } else {
      throw new Error('Error fetching access token: ' + JSON.stringify(tokenData));
    }
  } catch (error) {
    console.error('Error in token request:', error);
    throw error;
  }
}

// Sample MOT test data generator - in production this would connect to a real MOT API
function generateMockMotData(registration: string) {
  // Generate consistent pseudo-random data based on registration
  const hash = Array.from(registration).reduce((acc, char) => 
    acc + char.charCodeAt(0), 0);
  
  const randomSeed = hash % 100;
  const isPass = randomSeed > 30; // 70% chance of passing
  
  const makes = ['Ford', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Nissan'];
  const models = ['Focus', 'Golf', '3 Series', 'A-Class', 'A4', 'Corolla', 'Civic', 'Qashqai'];
  const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Grey', 'Green'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  
  const makeIndex = hash % makes.length;
  const modelIndex = (hash * 3) % models.length;
  const colorIndex = (hash * 7) % colors.length;
  const fuelIndex = (hash * 13) % fuelTypes.length;
  
  // Generate manufacture date between 5-15 years ago
  const currentYear = new Date().getFullYear();
  const age = 5 + (hash % 10);
  const manufactureYear = currentYear - age;
  const manufactureDate = `${manufactureYear}-01-01`;
  
  // Generate mock MOT tests
  const numTests = 1 + (hash % 7); // 1-7 tests
  const motTests = [];
  let mileage = 10000 + (hash * 1000);
  
  // Current date for calculations
  const now = new Date();
  const lastTestDate = new Date();
  lastTestDate.setMonth(lastTestDate.getMonth() - (randomSeed % 11)); // 0-10 months ago
  
  for (let i = 0; i < numTests; i++) {
    const testDate = new Date(lastTestDate);
    testDate.setFullYear(testDate.getFullYear() - i);
    
    const testPassed = i === 0 ? isPass : (hash + i) % 100 > 25; // First test uses our random seed, others have 75% pass rate
    
    // If the test passed, add an expiry date 1 year later
    let expiryDate;
    if (testPassed) {
      expiryDate = new Date(testDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    // Generate random defects - more for failures
    const defects = [];
    const numDefects = testPassed ? (hash % 3) : 1 + (hash % 5);
    
    const possibleDefects = [
      { text: 'Brake performance not at minimum requirement', type: 'dangerous' },
      { text: 'Brake pipe damaged or insecure', type: 'major' },
      { text: 'Steering wheel loose', type: 'dangerous' },
      { text: 'Tyre tread depth below requirements', type: 'dangerous' },
      { text: 'Headlamp aim outwith limits', type: 'major' },
      { text: 'Windscreen wiper blade deteriorated', type: 'minor' },
      { text: 'Exhaust emissions exceeded regulated limits', type: 'major' },
      { text: 'Anti-lock brake warning lamp indicates a problem', type: 'major' },
      { text: 'Seat belt mounting damaged', type: 'major' },
      { text: 'Fuel tank cap missing', type: 'minor' }
    ];
    
    for (let j = 0; j < numDefects; j++) {
      const index = (hash + i + j) % possibleDefects.length;
      defects.push(possibleDefects[index]);
    }
    
    motTests.push({
      testResult: testPassed ? 'PASSED' : 'FAILED',
      completedDate: testDate.toISOString(),
      expiryDate: expiryDate?.toISOString(),
      odometerValue: mileage,
      odometerUnit: 'mi',
      defects: testPassed ? [] : defects
    });
    
    // Reduce mileage for older tests
    mileage -= 8000 + (hash % 4000); // 8000-12000 miles per year
    if (mileage < 1000) mileage = 1000;
  }
  
  // Determine if ULEZ compliant based on age and fuel type
  const isUlezCompliant = age < 6 || fuelTypes[fuelIndex] === 'Electric' || 
    (fuelTypes[fuelIndex] === 'Hybrid' && age < 10);
  
  return {
    make: makes[makeIndex],
    model: models[modelIndex],
    primaryColour: colors[colorIndex],
    fuelType: fuelTypes[fuelIndex],
    manufactureDate,
    engineSize: (1000 + (hash % 2000)).toString(),
    motTests,
    ulezCompliant: isUlezCompliant
  };
}

// In production, use Upstash Redis for rate limiting
// For development, create a simple fallback
let ratelimit: Ratelimit;

if (process.env.UPSTASH_REDIS_REST_URL) {
  // Use Upstash Redis when configured
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
  
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1h'), // 10 requests per hour per IP
    analytics: true,
    prefix: 'ratelimit:mot-check:',
  });
} else {
  // Simple in-memory fallback for development
  const ipRequestCounts = new Map<string, { count: number, resetAt: number }>();
  
  ratelimit = {
    limit: async (ip: string) => {
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;
      const resetAt = now + hourInMs;
      
      if (!ipRequestCounts.has(ip)) {
        ipRequestCounts.set(ip, { count: 1, resetAt });
        return { success: true, limit: 10, remaining: 9, reset: resetAt };
      }
      
      const record = ipRequestCounts.get(ip)!;
      
      // Reset counter if the time has expired
      if (now > record.resetAt) {
        ipRequestCounts.set(ip, { count: 1, resetAt });
        return { success: true, limit: 10, remaining: 9, reset: resetAt };
      }
      
      // If under limit, increment and allow
      if (record.count < 10) {
        record.count++;
        ipRequestCounts.set(ip, record);
        return { 
          success: true, 
          limit: 10, 
          remaining: 10 - record.count, 
          reset: record.resetAt 
        };
      }
      
      // Over limit
      return { 
        success: false, 
        limit: 10, 
        remaining: 0, 
        reset: record.resetAt 
      };
    }
  } as Ratelimit;
}

export async function GET(request: NextRequest) {
  try {
    // Get IP from request headers
    const headersList = await headers();
    let ip = 'unknown';
    
    // Extract IP address
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    }
    
    // Check if the request is from our site
    const origin = headersList.get('origin') || '';
    const allowedOrigins = [
      'http://localhost:3000',
      'https://asmperformancecars.co.uk',
      'https://www.asmperformancecars.co.uk'
    ];
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized request' },
        { status: 403 }
      );
    }
    
    // Rate limiting check
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    // Get registration from query params
    const url = new URL(request.url);
    const registration = url.searchParams.get('registration');
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }
    
    // Clean registration number
    const cleanReg = registration.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // In a real implementation, this would call the actual DVLA API
    // For this example, we generate mock data based on the registration
    const motData = generateMockMotData(cleanReg);
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(motData);
  } catch (error) {
    console.error('Error processing MOT check:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve MOT information' },
      { status: 500 }
    );
  }
} 