import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    // Get registration number from query parameter
    const { searchParams } = new URL(request.url);
    const registration = searchParams.get('registration');

    if (!registration) {
      return NextResponse.json(
        { error: 'No registration provided' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // MOT History API URL - Using environment variable for the base URL or fallback to the original
    const motApiUrl = `${process.env.DVSA_MOT_API_URL || 'https://history.mot.api.gov.uk/v1/trade/vehicles/registration/'}${registration}`;
    
    // Use API key from environment variable
    const apiKey = process.env.DVSA_API_KEY;
    
    // Check if API key is available
    if (!apiKey) {
      console.error('DVSA API key not found in environment variables');
      throw new Error('API key not configured');
    }

    // Set up headers for the API request
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': apiKey,
      'Accept': 'application/json'
    };

    // Make the request to the MOT History API
    const motResponse = await fetch(motApiUrl, {
      method: 'GET',
      headers: headers,
    });

    // Get the response data
    const motData = await motResponse.json();

    // Check if there were errors
    if (motResponse.status !== 200 || motData.errors) {
      const errorMessage = motData.errors 
        ? motData.errors[0]?.detail || 'Unknown error' 
        : 'Error retrieving MOT history';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: motResponse.status !== 200 ? motResponse.status : 400 }
      );
    }

    // Return the MOT data
    return NextResponse.json(motData);
  } catch (error) {
    console.error('Error in MOT check:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve MOT history' },
      { status: 500 }
    );
  }
} 