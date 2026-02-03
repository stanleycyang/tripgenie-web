/**
 * TripGenie AI Module
 * Export all AI-related functions and types
 */

// Core API functions
export {
  generateItinerary,
  generateActivities,
  generateRestaurants,
  validateApiKey,
  estimateTokens,
  estimateCost,
} from './claude';

// Type definitions
export type {
  TripPreferences,
  Activity,
  Restaurant,
  TripDay,
  GeneratedItinerary,
  ItineraryGenerationRequest,
  StreamingProgress,
  AIGenerationError,
} from './types';

// Prompts (for advanced usage)
export {
  SYSTEM_PROMPT,
  buildItineraryPrompt,
  buildActivityRecommendationPrompt,
  buildRestaurantPrompt,
  VIBE_EXAMPLES,
} from './prompts';
