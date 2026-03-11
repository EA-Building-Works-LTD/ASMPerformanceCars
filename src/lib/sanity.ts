import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

type SiteSettings = {
  phoneNumber?: string
  contactEmail?: string
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await client.fetch<SiteSettings>(
      `*[_type == "siteSettings"][0]{phoneNumber, contactEmail}`
    )
    return settings ?? null
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error)
    return null
  }
}