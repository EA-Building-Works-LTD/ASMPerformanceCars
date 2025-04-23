// Types for FAQs
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  categorySlug?: string;
}

// Import all FAQ data from category pages
import { carInsuranceFaqs } from '@/app/faqs/car-insurance-faqs/data';
import { usedCarsFaqs } from '@/app/faqs/used-cars-faqs/data';
import { carBuyingSellingFaqs } from '@/app/faqs/car-buying-selling-faqs/data';
import { hybridElectricFaqs } from '@/app/faqs/hybrid-electric-cars-faqs/data';
import { modifiedCarFaqs } from '@/app/faqs/modified-cars-faqs/data';
import { carFinanceFaqs } from '@/app/faqs/car-finance-faqs/data';

// Add category information to each FAQ item
const allFaqs: FAQItem[] = [
  ...carInsuranceFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Car Insurance', 
    categorySlug: 'car-insurance-faqs' 
  })),
  ...usedCarsFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Used Cars', 
    categorySlug: 'used-cars-faqs' 
  })),
  ...carBuyingSellingFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Car Buying & Selling', 
    categorySlug: 'car-buying-selling-faqs'
  })),
  ...hybridElectricFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Hybrid & Electric Cars', 
    categorySlug: 'hybrid-electric-cars-faqs'
  })),
  ...modifiedCarFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Modified Cars', 
    categorySlug: 'modified-cars-faqs'
  })),
  ...carFinanceFaqs.map((faq: FAQItem) => ({ 
    ...faq, 
    category: 'Car Finance', 
    categorySlug: 'car-finance-faqs'
  }))
];

interface ScoredFAQItem extends FAQItem {
  score: number;
}

/**
 * Searches all FAQs for matching content
 * @param query Search query string
 * @returns Array of matching FAQ items
 */
export function searchFaqs(query: string): FAQItem[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Search logic with relevance scoring
  const results: ScoredFAQItem[] = allFaqs
    .map((faq: FAQItem) => {
      // Check if question or answer contains the query
      const questionMatch = faq.question.toLowerCase().includes(normalizedQuery);
      const answerMatch = faq.answer.toLowerCase().includes(normalizedQuery);
      
      // Skip items that don't match at all
      if (!questionMatch && !answerMatch) {
        return null;
      }
      
      // Calculate relevance score
      // Question matches are weighted more heavily than answer matches
      let score = 0;
      
      // Question title matching gives higher score
      if (questionMatch) {
        score += 10;
        // Exact match or starts with the query gets even higher score
        if (faq.question.toLowerCase() === normalizedQuery) {
          score += 15;
        } else if (faq.question.toLowerCase().startsWith(normalizedQuery)) {
          score += 8;
        }
      }
      
      // Answer content matching
      if (answerMatch) {
        score += 5;
      }
      
      return { ...faq, score };
    })
    .filter((item): item is ScoredFAQItem => item !== null) // Remove null items (non-matches)
    .sort((a, b) => b.score - a.score); // Sort by relevance score, highest first
  
  return results;
}

/**
 * Highlights the search term in the provided text
 * @param text Text to highlight within
 * @param query Search query to highlight
 * @returns Text with search terms wrapped in highlight tags
 */
export function highlightText(text: string, query: string): string {
  if (!query || query.trim() === '') {
    return text;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  const regex = new RegExp(`(${normalizedQuery})`, 'gi');
  
  return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>');
} 