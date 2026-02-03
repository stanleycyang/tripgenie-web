import { MetadataRoute } from 'next'

// Static destinations for sitemap
const popularDestinations = [
  'tokyo', 'paris', 'bali', 'santorini', 'new-york', 'barcelona',
  'london', 'rome', 'dubai', 'sydney', 'amsterdam', 'kyoto',
  'maldives', 'iceland', 'marrakech', 'singapore', 'bangkok', 'lisbon',
  'prague', 'vienna', 'berlin', 'copenhagen', 'oslo', 'stockholm'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tripgenie.ai'
  const currentDate = new Date().toISOString()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
  
  // Destination landing pages (for future implementation)
  const destinationPages: MetadataRoute.Sitemap = popularDestinations.map(dest => ({
    url: `${baseUrl}/destinations/${dest}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [...staticPages, ...destinationPages]
}
