// Script to update all posts with author "ehsaan" to "Daniel Shaw"
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get current file directory (for ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local file in the project root
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Debug environment variables
console.log('Environment variables:')
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('API Token exists:', !!process.env.SANITY_API_TOKEN)

// Ensure we have all required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is missing')
  console.error('Make sure your .env.local file in the project root has the correct values')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('Error: NEXT_PUBLIC_SANITY_DATASET environment variable is missing')
  process.exit(1)
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN environment variable is missing')
  console.error('Add SANITY_API_TOKEN to your .env.local file with a write token from https://www.sanity.io/manage')
  process.exit(1)
}

// Configure the client with environment variables
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03', // Use current date in YYYY-MM-DD format
  useCdn: false // We need the latest data, not cached
})

async function updateAuthors() {
  try {
    console.log('Starting author update process...')
    
    // Step 1: Find the author document for "Daniel Shaw"
    console.log('Looking for "Daniel Shaw" author document...')
    const danielShaw = await client.fetch('*[_type == "author" && name == "Daniel Shaw"][0]')
    
    if (!danielShaw) {
      console.error('Error: Could not find author "Daniel Shaw". Please create this author first.')
      process.exit(1)
    }
    
    console.log(`Found Daniel Shaw with ID: ${danielShaw._id}`)
    
    // Step 2: Find all posts with author "ehsaan"
    console.log('Finding all posts with author "ehsaan"...')
    const postsToUpdate = await client.fetch(`
      *[_type == "post" && author->name == "ehsaan"]{
        _id,
        title
      }
    `)
    
    if (postsToUpdate.length === 0) {
      console.log('No posts found with author "ehsaan". Nothing to update.')
      process.exit(0)
    }
    
    console.log(`Found ${postsToUpdate.length} posts to update:`)
    postsToUpdate.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (ID: ${post._id})`)
    })
    
    // Step 3: Update all posts with a transaction
    console.log('\nUpdating author references...')
    const transaction = client.transaction()
    
    postsToUpdate.forEach(post => {
      transaction.patch(post._id, {
        set: {
          author: {
            _type: 'reference',
            _ref: danielShaw._id
          }
        }
      })
    })
    
    // Step 4: Commit the transaction
    console.log('Committing changes...')
    await transaction.commit()
    
    console.log('\n✅ Success! Updated author from "ehsaan" to "Daniel Shaw" for all posts.')
    console.log(`Total posts updated: ${postsToUpdate.length}`)
    
  } catch (error) {
    console.error('Error updating authors:', error)
    process.exit(1)
  }
}

// Run the update function
updateAuthors() 