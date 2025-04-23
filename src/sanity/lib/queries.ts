import { client } from './client'
import { cache } from 'react'

// Cached query for global footer ad
export const getGlobalFooterAd = cache(async () => {
  return client.fetch(`
    *[_type == "blogAd" && isActive == true && displayLocation == "global_footer"][0] {
      _id,
      title,
      adSize,
      adImage,
      adVideo,
      link,
      trackingId
    }
  `)
}) 