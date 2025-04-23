# ASM Performance Blog Advertisement System

## Overview
This document provides an overview of the advertisement system implemented for the ASM Performance blog. The system allows for displaying both image and video ads in various sizes, with strategic placement options throughout blog posts.

## Ad Sizes
The following standard ad sizes are supported:

1. **Wide Skyscraper** (160x600)
2. **Square** (250x250)
3. **Mobile Banner** (320x100)
4. **Standard Banner** (728x90)
5. **Large Banner** (970x90)

## Ad Content Types
Each advertisement can include:

- **Image Ad**: Required as a primary ad or fallback
- **Video Ad**: Optional, prioritized over image when provided
- **Link**: Target URL when the ad is clicked

## Placement Options
Ads can be placed in three strategic locations:

1. **Below Key Takeaways**: Positioned after the key takeaways section
2. **Mid-Content**: Intelligently placed in the middle of the article content
3. **Above Author Bio**: Positioned between the article content and author biography

## Managing Ads in Sanity CMS

### Creating a New Ad
1. Navigate to "Blog Advertisements" in your Sanity Studio
2. Click "Create new document"
3. Fill in the required fields:
   - **Basic Information**: Title, size, link, tracking ID
   - **Ad Content**: Upload image and/or video
   - **Placement**: Select where the ad should appear

### Ad Fields
- **Title**: Internal reference name for the ad
- **Advertisement Size**: Select from supported ad sizes
- **Advertisement Image**: Upload the image (required, serves as fallback)
- **Advertisement Video**: Upload video file (optional, prioritized over image)
- **Advertisement Link**: Target URL
- **Active**: Toggle to enable/disable the ad
- **Display Location**: Where the ad will appear
- **Tracking ID**: Optional identifier for analytics

### User Experience
- Ads are clearly labeled as "Advertisement"
- Users can dismiss ads by clicking the X button
- Video ads autoplay silently (muted) and loop
- If a video fails to load, the system automatically falls back to the image

## Technical Implementation

### Components
- **BlogAd.tsx**: Handles rendering of ads with proper sizing and content type prioritization
- **BlogAdType.ts**: Sanity schema definition for ads

### Best Practices
- Always provide an image even when using video (serves as fallback)
- Choose appropriate ad sizes for target devices
- Keep videos short and optimized for web
- Refresh ad content periodically to prevent ad fatigue

## Troubleshooting
- If videos aren't playing, check format compatibility (MP4 recommended)
- If ad sizes appear incorrect, verify the correct size is selected in Sanity
- For ad tracking issues, check that tracking IDs are correctly configured