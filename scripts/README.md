# Sanity CMS Scripts

This directory contains utility scripts for managing your Sanity CMS content.

## Change Authors Script

The `change-authors.js` script updates all blog posts with author "ehsaan" to have "Daniel Shaw" as the author.

### Prerequisites

1. Make sure "Daniel Shaw" already exists as an author in your Sanity CMS.
2. Add a Sanity API token to your `.env.local` file in the project root:

```
# Add this to your existing .env.local file
SANITY_API_TOKEN="your-write-token-here"
```

### How to get a Sanity API token

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to API > Tokens
4. Create a new token with "Editor" or higher permissions
5. Copy the token (you won't be able to see it again)

### Running the script

```bash
# Navigate to the scripts directory
cd scripts

# Install dependencies 
npm install

# Run the script
node change-authors.js
```

The script will:
1. Find the "Daniel Shaw" author document in your Sanity database
2. Find all posts currently authored by "ehsaan"
3. Show you which posts will be updated
4. Update all those posts to have "Daniel Shaw" as the author

If you run into any issues, check that your `.env.local` file contains:
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
- SANITY_API_TOKEN 