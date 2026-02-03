# TripGenie SEO Implementation Guide

## Overview

This document outlines the SEO optimizations implemented for TripGenie (tripgenie.ai), including meta tags, structured data, sitemaps, and best practices.

## Implemented Features

### 1. Meta Tags (All Pages)

#### Root Layout (`app/layout.tsx`)
- **Title template**: `%s | TripGenie` for consistent branding
- **Default title**: "TripGenie - AI-Powered Travel Planning | Create Itineraries in 60 Seconds"
- **Meta description**: Optimized for travel planning keywords
- **Keywords**: AI travel planner, trip planning app, travel itinerary generator, etc.
- **Authors & Publisher**: TripGenie Team
- **Format Detection**: Disabled for email, address, telephone

#### OpenGraph Tags
- Type: website
- Locale: en_US
- Site name: TripGenie
- Dynamic OG images via `opengraph-image.tsx`

#### Twitter Cards
- Card type: summary_large_image
- Dynamic images via `twitter-image.tsx`

### 2. Page-Specific Metadata

| Page | Title | Indexed |
|------|-------|---------|
| Landing (`/`) | Full branded title | ✅ Yes |
| Create (`/create`) | "Create Your Trip" | ✅ Yes |
| Login (`/auth/login`) | "Sign In" | ✅ Yes |
| Signup (`/auth/signup`) | "Create Account" | ✅ Yes |
| Dashboard (`/dashboard`) | "Dashboard" | ❌ No (private) |
| Trip Detail (`/trips/[id]`) | Dynamic: "{duration} {destination} Trip" | ❌ No (private) |

### 3. Dynamic OG Images

Trip pages generate dynamic OpenGraph images showing:
- Destination name
- Trip duration
- Travel dates
- Number of travelers
- Destination emoji
- TripGenie branding

Located at:
- `app/opengraph-image.tsx` - Default site OG image
- `app/twitter-image.tsx` - Default Twitter card
- `app/(app)/trips/[id]/opengraph-image.tsx` - Dynamic trip OG images

### 4. Structured Data (JSON-LD)

Three schema types implemented in root layout:

#### Organization Schema
```json
{
  "@type": "Organization",
  "name": "TripGenie",
  "url": "https://tripgenie.ai",
  "logo": "https://tripgenie.ai/icon.png",
  "sameAs": ["twitter", "instagram", "facebook"]
}
```

#### WebSite Schema
```json
{
  "@type": "WebSite",
  "name": "TripGenie",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tripgenie.ai/?destination={search_term}"
  }
}
```

#### SoftwareApplication Schema
```json
{
  "@type": "SoftwareApplication",
  "applicationCategory": "TravelApplication",
  "aggregateRating": {
    "ratingValue": "4.9",
    "ratingCount": "12000"
  }
}
```

### 5. robots.txt (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/callback
Disallow: /auth/logout
Disallow: /.well-known/
Disallow: /dashboard
Disallow: /trips/*

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /auth/callback
Disallow: /auth/logout

Sitemap: https://tripgenie.ai/sitemap.xml
```

### 6. Sitemap (`app/sitemap.ts`)

Dynamic sitemap including:
- Static pages (/, /create, /auth/login, /auth/signup)
- Destination landing pages (/destinations/{city})
- Priority and changeFrequency configured

### 7. Error Pages

#### 404 Not Found (`app/not-found.tsx`)
- Branded design with travel theme
- Quick navigation to home and trip planning
- Popular destinations suggestions

#### Error Page (`app/error.tsx`)
- User-friendly error messaging
- Retry functionality
- Development error details
- Support contact link

### 8. Social Sharing

#### ShareButtons Component (`components/ShareButtons.tsx`)
- Twitter, Facebook, LinkedIn, WhatsApp
- Email sharing
- Copy link functionality
- Native share API support
- Compact and full modes

#### Usage
```tsx
import { ShareButtons } from '@/components/ShareButtons'

<ShareButtons
  title="My Trip to Paris"
  description="Check out my itinerary!"
  hashtags={['TripGenie', 'Travel', 'Paris']}
/>
```

### 9. PWA Support

#### manifest.json
- App name and description
- Icon sizes (192x192, 512x512)
- Theme color: #6366f1
- Categories: travel, lifestyle, productivity
- App store links (placeholder)

### 10. Performance Considerations

- **Server Components**: Most pages use React Server Components for faster initial load
- **Dynamic Imports**: Heavy components loaded dynamically
- **Image Optimization**: Next.js Image component with proper sizing
- **Font Optimization**: Google Fonts via next/font

## Environment Variables

Required for full SEO functionality:

```env
NEXT_PUBLIC_BASE_URL=https://tripgenie.ai
GOOGLE_SITE_VERIFICATION=your-verification-code
```

## Testing Checklist

### Tools to Use

1. **Google Search Console** - Verify ownership, submit sitemap
2. **Lighthouse** - SEO audit (aim for 90+ score)
3. **OpenGraph Validator** - https://www.opengraph.xyz/
4. **Twitter Card Validator** - https://cards-dev.twitter.com/validator
5. **Rich Results Test** - https://search.google.com/test/rich-results
6. **Mobile-Friendly Test** - https://search.google.com/test/mobile-friendly

### Manual Checks

- [ ] Title displays correctly in browser tab
- [ ] Meta description appears in search results preview
- [ ] OG images display correctly when sharing on social media
- [ ] robots.txt accessible at /robots.txt
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] 404 page displays for invalid URLs
- [ ] Error page catches runtime errors gracefully
- [ ] Share buttons work on trip detail pages
- [ ] Canonical URLs are correct
- [ ] No duplicate content issues

## Future Improvements

1. **Blog/Content Pages** - Add travel guides for SEO content
2. **Destination Landing Pages** - Create `/destinations/[slug]` pages
3. **Hreflang Tags** - For multi-language support
4. **Local Business Schema** - If physical offices exist
5. **FAQ Schema** - For common questions
6. **Breadcrumb Schema** - For better navigation in SERPs
7. **Video Schema** - If video content is added
8. **Analytics Integration** - GA4, Search Console API

## Files Created/Modified

### New Files
- `app/robots.ts`
- `app/sitemap.ts`
- `app/not-found.tsx`
- `app/error.tsx`
- `app/opengraph-image.tsx`
- `app/twitter-image.tsx`
- `app/create/layout.tsx`
- `app/(app)/dashboard/layout.tsx`
- `app/(app)/trips/[id]/layout.tsx`
- `app/(app)/trips/[id]/opengraph-image.tsx`
- `app/auth/login/layout.tsx`
- `app/auth/signup/layout.tsx`
- `components/ShareButtons.tsx`
- `public/manifest.json`
- `docs/SEO.md`

### Modified Files
- `app/layout.tsx` - Added comprehensive metadata and structured data
- `app/(app)/trips/[id]/page.tsx` - Added ShareButtons component
- `components/index.ts` - Exported ShareButtons

## Quick Commands

```bash
# Build and check for errors
npm run build

# Run Lighthouse audit (requires Chrome)
npx lighthouse https://tripgenie.ai --view

# Check robots.txt
curl https://tripgenie.ai/robots.txt

# Check sitemap
curl https://tripgenie.ai/sitemap.xml

# Test OG image
open https://tripgenie.ai/opengraph-image
```

---

Last updated: February 3, 2026
