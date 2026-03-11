import { Layout } from '@/components/layout/Layout'
import { Metadata } from 'next'
import { BlogSearchResults } from '@/components/blog/BlogSearchResults'

type SearchParams = {
  q?: string;
};

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<SearchParams> }
): Promise<Metadata> {
  const { q } = await searchParams
  const query = q || ''
  
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
    },
  }
}

export default async function BlogSearchPage(
  { searchParams }: { searchParams: Promise<SearchParams> }
) {
  const { q } = await searchParams
  const query = q || ''
  
  return (
    <Layout>
      <BlogSearchResults initialQuery={query} />
    </Layout>
  )
} 