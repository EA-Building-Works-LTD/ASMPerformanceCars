/**
 * This script helps you find your Klaviyo list IDs
 * Run with: node src/scripts/klaviyo-setup.js
 */

const https = require('https');

// Replace with your Klaviyo API key
const apiKey = 'pk_df2266ea63fbd4b50ae551af2596e651b5';

const options = {
  hostname: 'a.klaviyo.com',
  path: '/api/v2/lists?api_key=' + apiKey,
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const lists = JSON.parse(data);
        console.log('Available Klaviyo Lists:');
        console.log('------------------------');
        
        if (lists.length === 0) {
          console.log('No lists found. Please create a list in your Klaviyo account first.');
        } else {
          lists.forEach(list => {
            console.log(`List Name: ${list.name}`);
            console.log(`List ID: ${list.id}`);
            console.log('------------------------');
          });

          console.log('\nInstructions:');
          console.log('1. Copy the List ID for the list you want to use');
          console.log('2. Add it to your .env.local file: KLAVIYO_LIST_ID=your_list_id');
          console.log('3. Restart your development server');
        }
      } catch (error) {
        console.error('Error parsing response:', error.message);
      }
    } else {
      console.error('Error fetching lists:', res.statusCode, res.statusMessage);
      console.error('Make sure your API key is correct.');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();

console.log('Fetching your Klaviyo lists...'); 