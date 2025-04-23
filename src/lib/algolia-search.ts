import algoliasearch from 'algoliasearch';

// Initialize the Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''
);

// Get the FAQ index
const faqIndex = client.initIndex('faqs');

// Define the FAQ item type
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  categorySlug?: string;
}

/**
 * Search FAQs using Algolia
 * @param query The search query
 * @returns Promise<FAQItem[]> Array of FAQ items matching the search query
 */
export async function searchFaqs(query: string): Promise<FAQItem[]> {
  try {
    const { hits } = await faqIndex.search<FAQItem>(query, {
      attributesToRetrieve: ['id', 'question', 'answer', 'category', 'categorySlug'],
      hitsPerPage: 10
    });
    
    return hits;
  } catch (error) {
    console.error('Error searching FAQs:', error);
    return [];
  }
} 