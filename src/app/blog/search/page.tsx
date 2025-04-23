import { Layout } from '@/components/layout/Layout'
import { Metadata } from 'next'
import { BlogSearchResults } from '@/components/blog/BlogSearchResults'

type Props = {
  searchParams: {
    q?: string;
  };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  const query = searchParams.q || ''
  
  return {
    title: query 
      ? `Search results for "${query}" | ASM Performance Cars` 
      : 'Blog Search | ASM Performance Cars',
    description: query 
      ? `Find articles about ${query} in our performance car blog.` 
      : 'Search our blog for articles about performance cars, modifications, and automotive excellence.',
    openGraph: {
      title: query 
        ? `Search results for "${query}" | ASM Performance Cars` 
        : 'Blog Search | ASM Performance Cars',
      description: query 
        ? `Find articles about ${query} in our performance car blog.` 
        : 'Search our blog for articles about performance cars, modifications, and automotive excellence.',
    }
  }
}

export default function BlogSearchPage({ searchParams }: Props) {
  const query = searchParams.q || ''
  
  return (
    <Layout>
      <BlogSearchResults initialQuery={query} />
    </Layout>
  )
} 