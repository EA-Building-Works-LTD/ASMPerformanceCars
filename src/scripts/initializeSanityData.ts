import { initializeMotCheckPage, initializeFinancePage } from '@/sanity/lib/client';

async function initializeData() {
  console.log('Starting Sanity data initialization...');
  
  try {
    // Initialize MOT check page
    const motPageCreated = await initializeMotCheckPage();
    
    if (motPageCreated) {
      console.log('✅ MOT check page created successfully');
    } else {
      console.log('ℹ️ MOT check page already exists, skipping creation');
    }
    
    // Initialize Finance page
    const financePageCreated = await initializeFinancePage();
    
    if (financePageCreated) {
      console.log('✅ Finance page created successfully');
    } else {
      console.log('ℹ️ Finance page already exists, skipping creation');
    }
    
    // Add more initialization functions for other document types as needed
    
    console.log('✅ All Sanity data initialization completed successfully');
  } catch (error) {
    console.error('❌ Error initializing Sanity data:', error);
  }
}

// Run the initialization function
initializeData(); 