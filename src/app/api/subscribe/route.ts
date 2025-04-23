import { NextResponse } from 'next/server';

// Klaviyo API key from environment variables for security
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY || '';
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || '';
// Disable mock mode to ensure real API calls
const USE_MOCK_SUCCESS = false;

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    
    console.log('Received subscription request:', { name, email });

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Split the name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Verify Klaviyo credentials
    if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
      console.error('Klaviyo API key or list ID not configured');
      return NextResponse.json(
        { message: 'Newsletter service not properly configured' },
        { status: 500 }
      );
    }

    console.log('Sending data to Klaviyo:', { 
      list_id: KLAVIYO_LIST_ID,
      email,
      first_name: firstName,
      last_name: lastName
    });

    // Using the Klaviyo API (v3)
    try {
      // Step 1: Create the profile
      const profileResponse = await fetch('https://a.klaviyo.com/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email,
              first_name: firstName,
              last_name: lastName,
              properties: {
                signup_source: 'website_footer'
              }
            }
          }
        })
      });

      const profileResponseText = await profileResponse.text();
      console.log('Klaviyo profile response status:', profileResponse.status);
      console.log('Klaviyo profile response:', profileResponseText);
      
      if (!profileResponse.ok) {
        return NextResponse.json(
          { message: 'Error creating subscriber profile: ' + profileResponseText },
          { status: profileResponse.status }
        );
      }
      
      let profileData;
      try {
        profileData = JSON.parse(profileResponseText);
      } catch (e) {
        console.error('Error parsing profile response:', e);
        return NextResponse.json(
          { message: 'Invalid response from newsletter service' },
          { status: 500 }
        );
      }

      // Step 2: Set the subscription status
      const profileId = profileData.data.id;
      console.log('Profile created with ID:', profileId);
      
      const subscriptionResponse = await fetch(`https://a.klaviyo.com/api/profile-subscription-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-status',
            attributes: {
              profile_id: profileId,
              email_marketing: {
                consent: 'SUBSCRIBED',
                consent_timestamp: new Date().toISOString(),
                method: 'WEBSITE_FORM'
              }
            }
          }
        })
      });

      const subscriptionResponseText = await subscriptionResponse.text();
      console.log('Klaviyo subscription status response:', subscriptionResponse.status);
      console.log('Klaviyo subscription status response body:', subscriptionResponseText);

      if (!subscriptionResponse.ok) {
        console.error('Failed to set subscription status:', subscriptionResponseText);
      }
      
      // Step 3: Add the profile to the list
      const listResponse = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15' // Use lowercase "revision" as shown in the logs
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: profileId
            }
          ]
        })
      });

      const listResponseText = await listResponse.text();
      console.log('Klaviyo list response status:', listResponse.status);
      console.log('Klaviyo list response:', listResponseText);
      
      if (!listResponse.ok) {
        return NextResponse.json(
          { message: 'Subscriber created but could not add to newsletter list: ' + listResponseText },
          { status: listResponse.status }
        );
      }

      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter' },
        { status: 200 }
      );
    } catch (e) {
      console.error('Error subscribing to newsletter:', e);
      return NextResponse.json(
        { message: 'Error connecting to newsletter service' },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error('Error processing subscription request:', e);
    return NextResponse.json(
      { message: 'Error processing subscription request' },
      { status: 500 }
    );
  }
}