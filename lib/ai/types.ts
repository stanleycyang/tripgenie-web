/**
 * TripGenie AI Type Definitions
 * Structured types for AI-generated travel itineraries
 */

export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'moderate' | 'luxury';
  vibes: string[]; // e.g., ["adventure", "foodie", "relaxed", "cultural"]
  travelers: {
    adults: number;
    children: number;
  };
  interests?: string[];
  dietaryRestrictions?: string[];
  mobilityNeeds?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  estimatedCost: {
    amount: number;
    currency: string;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  category: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'entertainment' | 'shopping';
  location: {
    name: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  vibeMatch: {
    matchedVibes: string[];
    reasoning: string;
  };
  bookingInfo?: {
    requiresReservation: boolean;
    bookingUrl?: string;
    affiliateId?: string;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string[];
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
  description: string;
  estimatedCost: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  location: {
    name: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  dietaryOptions: string[];
  vibeMatch: {
    matchedVibes: string[];
    reasoning: string;
  };
  reservationInfo?: {
    recommended: boolean;
    url?: string;
  };
}

export interface TripDay {
  dayNumber: number;
  date: string;
  title: string; // e.g., "Exploring Ancient Rome"
  summary: string;
  morning: {
    activities: Activity[];
    meals: Restaurant[];
  };
  afternoon: {
    activities: Activity[];
    meals: Restaurant[];
  };
  evening: {
    activities: Activity[];
    meals: Restaurant[];
  };
  totalEstimatedCost: {
    amount: number;
    currency: string;
  };
  tips: string[];
}

export interface GeneratedItinerary {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  totalEstimatedCost: {
    amount: number;
    currency: string;
  };
  overview: string;
  packingList?: string[];
  generalTips?: string[];
  generatedAt: string;
}

export interface ItineraryGenerationRequest {
  preferences: TripPreferences;
  userId: string;
  additionalNotes?: string;
}

export interface StreamingProgress {
  status: 'started' | 'processing' | 'completed' | 'error';
  currentDay?: number;
  totalDays: number;
  message: string;
  partialItinerary?: Partial<GeneratedItinerary>;
}

export interface AIGenerationError {
  code: string;
  message: string;
  details?: any;
}
