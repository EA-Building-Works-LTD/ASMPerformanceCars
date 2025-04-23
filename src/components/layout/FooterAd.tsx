'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveBlogAd from '../blog/ResponsiveBlogAd'
import { getGlobalFooterAd } from '@/sanity/lib/queries'

export const FooterAd = () => {
  const [footerAd, setFooterAd] = useState<any>(null)
  const [mobileAd, setMobileAd] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFooterAd = async () => {
      try {
        const result = await getGlobalFooterAd()
        
        if (result) {
          // Create desktop version (970x90)
          setFooterAd({
            ...result,
            adSize: '970x90'
          })
          
          // Create mobile version (393x90)
          setMobileAd({
            ...result,
            adSize: '393x90'
          })
        }
      } catch (error) {
        console.error('Error fetching footer ad:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterAd()
  }, [])

  if (isLoading || !footerAd) return null

  return (
    <div className="py-3 mt-2 mb-4">
      <ResponsiveBlogAd 
        desktopAd={footerAd}
        mobileAd={mobileAd}
        className="mt-0"
        variant="footer"
      />
    </div>
  )
}

export default FooterAd 