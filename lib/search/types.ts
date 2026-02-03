/**
 * TripGenie Search Types
 * Types for the multi-agent travel search system
 */

export interface SearchInput {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelerType?: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  vibes: string[];
  budget?: 'budget' | 'moderate' | 'luxury';
  userId?: string;
}

export interface SearchRecord {
  id: string;
  user_id: string | null;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  traveler_type: string | null;
  vibes: string[];
  budget: string;
  status: SearchStatus;
  workflow_run_id: string | null;
  progress: SearchProgress;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export type SearchStatus = 'pending' | 'searching' | 'completed' | 'error';

export interface SearchProgress {
  orchestrator: AgentStatus;
  hotels: AgentStatus;
  activities: AgentStatus;
  dining: AgentStatus;
  aggregator: AgentStatus;
}

export type AgentStatus = 'pending' | 'searching' | 'done' | 'error';

// Agent outputs

export interface SearchPlan {
  destination: string;
  country: string;
  dates: {
    start: string;
    end: string;
    nights: number;
  };
  searchPriorities: ('hotels' | 'activities' | 'dining')[];
  hotelCriteria: {
    priceRange: { min: number; max: number };
    starRating: number[];
    amenities: string[];
    neighborhoods: string[];
  };
  activityCriteria: {
    categories: string[];
    pacePreference: 'relaxed' | 'moderate' | 'packed';
    mustSee: string[];
    interests: string[];
  };
  diningCriteria: {
    cuisineTypes: string[];
    priceRange: 'budget' | 'moderate' | 'upscale';
    dietaryNeeds: string[];
    mealPriorities: ('breakfast' | 'lunch' | 'dinner')[];
  };
  vibeInterpretation: {
    vibes: string[];
    searchKeywords: string[];
    avoidKeywords: string[];
  };
}

export interface HotelResult {
  id: string;
  name: string;
  description: string;
  starRating: number;
  userRating: number;
  reviewCount: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  amenities: string[];
  location: LocationInfo;
  images: string[];
  affiliateUrl: string;
  affiliatePartner: string;
  vibeScore: number;
  vibeMatch: string[];
}

export interface ActivityResult {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // minutes
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  location: LocationInfo;
  images: string[];
  affiliateUrl: string;
  affiliatePartner: string;
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  vibeScore: number;
  vibeMatch: string[];
  bookingRequired: boolean;
}

export interface DiningResult {
  id: string;
  name: string;
  description: string;
  cuisineTypes: string[];
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  location: LocationInfo;
  images: string[];
  reservationUrl?: string;
  affiliatePartner?: string;
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
  vibeScore: number;
  vibeMatch: string[];
  dietaryOptions: string[];
}

export interface LocationInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
}

export interface SearchResults {
  searchId: string;
  hotels: HotelResult[];
  activities: ActivityResult[];
  dining: DiningResult[];
  itinerary: SuggestedDay[];
}

export interface SuggestedDay {
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  hotel?: HotelResult;
  morning: {
    activities: ActivityResult[];
    meal?: DiningResult;
  };
  afternoon: {
    activities: ActivityResult[];
    meal?: DiningResult;
  };
  evening: {
    activities: ActivityResult[];
    meal?: DiningResult;
  };
  estimatedCost: number;
  currency: string;
  tips: string[];
}

// API response types

export interface StartSearchResponse {
  searchId: string;
  workflowRunId: string;
  status: 'started';
  estimatedTime: number;
}

export interface SearchStatusResponse {
  searchId: string;
  status: SearchStatus;
  progress: SearchProgress;
  results?: SearchResults;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// Vibe definitions for matching
export const VIBE_KEYWORDS: Record<string, string[]> = {
  adventure: ['hiking', 'outdoor', 'extreme', 'sports', 'thrill', 'adventure', 'excursion', 'tour'],
  relaxation: ['spa', 'beach', 'wellness', 'peaceful', 'quiet', 'relaxing', 'retreat', 'massage'],
  cultural: ['museum', 'history', 'art', 'heritage', 'traditional', 'local', 'architecture', 'historical'],
  foodie: ['culinary', 'food tour', 'cooking class', 'market', 'restaurant', 'tasting', 'michelin', 'local cuisine'],
  nightlife: ['bar', 'club', 'nightclub', 'cocktail', 'live music', 'entertainment', 'rooftop', 'lounge'],
  romantic: ['couples', 'romantic', 'sunset', 'candlelit', 'intimate', 'luxury', 'scenic', 'private'],
  nature: ['park', 'garden', 'wildlife', 'nature', 'scenic', 'landscape', 'trail', 'forest', 'mountain'],
  shopping: ['shopping', 'mall', 'boutique', 'market', 'souvenir', 'fashion', 'outlet', 'vintage'],
  wellness: ['yoga', 'meditation', 'spa', 'fitness', 'health', 'detox', 'wellness', 'healing'],
  photography: ['viewpoint', 'scenic', 'landmark', 'instagram', 'photogenic', 'iconic', 'panoramic', 'sunrise'],
};

export const BUDGET_RANGES: Record<string, { hotel: { min: number; max: number }; daily: number }> = {
  budget: { hotel: { min: 30, max: 100 }, daily: 100 },
  moderate: { hotel: { min: 100, max: 250 }, daily: 200 },
  luxury: { hotel: { min: 250, max: 1000 }, daily: 500 },
};
