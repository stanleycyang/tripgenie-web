import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TripGenie - AI-Powered Travel Planning',
  description: 'Plan your dream trip with AI. Book hotels, flights, and activities all in one place.',
  keywords: 'travel, AI, trip planning, vacation, itinerary, hotels, flights',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
