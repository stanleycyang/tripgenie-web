# TripGenie Affiliate Search Architecture

## Overview

A multi-agent system that searches travel affiliates when users create trips. The goal is to provide comprehensive, bookable results (hotels, activities, restaurants, transportation) with affiliate revenue.

## Revenue Model

| Partner Type | Commission Rate | Example Partners |
|-------------|-----------------|------------------|
| Hotels | 4-8% | Booking.com, Hotels.com, Agoda |
| Activities | 8-12% | Viator, GetYourGuide, Klook |
| Flights | $0.50-3 per booking | Skyscanner, Kiwi.com |
| Car Rentals | 3-6% | Rentalcars.com, Kayak |
| Restaurants | Reservations | OpenTable, TheFork |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile App                                │
│                   (Expo/React Native)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ POST /api/search/start
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Route                            │
│              POST /api/search/start                             │
│   - Validate input                                              │
│   - Create search record in Supabase                            │
│   - Start Vercel Workflow                                       │
│   - Return searchId for polling                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │ workflowRunId
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│               Vercel Workflow: travel-search                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Step 1: ORCHESTRATOR AGENT                  │  │
│  │  - Analyze user preferences                              │  │
│  │  - Determine search priorities                           │  │
│  │  - Plan parallel agent execution                         │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│    ┌────────────────────────┼────────────────────────┐         │
│    │                        │                        │         │
│    ▼                        ▼                        ▼         │
│ ┌─────────┐          ┌─────────────┐          ┌───────────┐   │
│ │ HOTELS  │          │ ACTIVITIES  │          │  DINING   │   │
│ │ AGENT   │          │   AGENT     │          │  AGENT    │   │
│ └────┬────┘          └──────┬──────┘          └─────┬─────┘   │
│      │                      │                       │          │
│      └──────────────────────┴───────────────────────┘          │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Step 2: AGGREGATOR AGENT                      │  │
│  │  - Combine results from all agents                       │  │
│  │  - Rank by relevance to user vibes                       │  │
│  │  - Apply affiliate links                                 │  │
│  │  - Format for mobile display                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ Results saved to Supabase
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                 │
│  - searches table (status, progress)                            │
│  - search_results table (hotels, activities, dining)            │
│  - Real-time subscriptions for mobile                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile App                               │
│  - Polls /api/search/[searchId]/status                         │
│  - OR subscribes to Supabase realtime                          │
│  - Displays results as they come in                             │
└─────────────────────────────────────────────────────────────────┘
```

## Agent Definitions

### 1. Orchestrator Agent
**Purpose**: Analyzes user input and coordinates search strategy
**Input**: User preferences (destination, dates, vibes, travelers, budget)
**Output**: Search plan with priorities and parameters for each sub-agent

```typescript
interface SearchPlan {
  destination: string;
  dates: { start: string; end: string };
  priorities: ('hotels' | 'activities' | 'dining' | 'transport')[];
  hotelParams: { priceRange: string; amenities: string[] };
  activityParams: { categories: string[]; pacePreference: string };
  diningParams: { cuisineTypes: string[]; priceRange: string };
}
```

### 2. Hotels Agent
**Purpose**: Search accommodation options from affiliate partners
**APIs**: 
- Rapid API: Hotels.com, Booking.com
- Amadeus Hotel Search API
- Google Places (backup for ratings/reviews)

**Output**: Ranked list of hotels with affiliate booking links

### 3. Activities Agent  
**Purpose**: Find bookable tours, experiences, attractions
**APIs**:
- Viator Partner API
- GetYourGuide Affiliate API
- Google Places for free attractions

**Output**: Day-by-day activity suggestions with booking links

### 4. Dining Agent
**Purpose**: Restaurant recommendations with reservation links
**APIs**:
- Google Places API (ratings, photos, hours)
- OpenTable Affiliate (reservations)
- Yelp Fusion API (reviews)

**Output**: Meal recommendations for each day

### 5. Aggregator Agent
**Purpose**: Combine and rank all results
**Logic**:
- Match results to user vibes (Adventure, Relaxation, Cultural, etc.)
- Score by: vibe match, ratings, price fit, location convenience
- Format as itinerary-ready suggestions

## API Endpoints

### POST /api/search/start
Start a new travel search workflow.

```typescript
// Request
{
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelerType: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  vibes: string[];
  budget?: 'budget' | 'moderate' | 'luxury';
}

// Response
{
  searchId: string;
  workflowRunId: string;
  status: 'started';
  estimatedTime: number; // seconds
}
```

### GET /api/search/[searchId]/status
Poll for search progress and results.

```typescript
// Response
{
  searchId: string;
  status: 'pending' | 'searching' | 'completed' | 'error';
  progress: {
    hotels: 'pending' | 'searching' | 'done';
    activities: 'pending' | 'searching' | 'done';
    dining: 'pending' | 'searching' | 'done';
  };
  results?: SearchResults;
  error?: string;
}
```

### GET /api/search/[searchId]/results
Get full results (after completion).

```typescript
interface SearchResults {
  hotels: HotelResult[];
  activities: ActivityResult[];
  dining: DiningResult[];
  itinerary: SuggestedItinerary;
}
```

## Database Schema (Supabase)

```sql
-- Search sessions
CREATE TABLE searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER DEFAULT 2,
  traveler_type TEXT,
  vibes TEXT[] DEFAULT '{}',
  budget TEXT DEFAULT 'moderate',
  status TEXT DEFAULT 'pending',
  workflow_run_id TEXT,
  progress JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Search results (stored by category)
CREATE TABLE search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'hotel', 'activity', 'dining'
  data JSONB NOT NULL,
  affiliate_url TEXT,
  affiliate_partner TEXT,
  vibe_score FLOAT,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for mobile subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE searches;
ALTER PUBLICATION supabase_realtime ADD TABLE search_results;
```

## Affiliate Partner APIs

### Phase 1 (MVP - Free/Low Cost)
1. **Google Places API** - $0 for first $200/month
   - Place search, details, photos, reviews
   - Good for dining, attractions

2. **Rapid API Travel Bundle** - Free tier available
   - Hotels.com, Booking.com aggregator
   - Activity APIs

### Phase 2 (Scale)
1. **Viator Partner Program** - Apply for API access
2. **Booking.com Affiliate** - Direct partnership
3. **GetYourGuide Affiliate** - Activity bookings
4. **Amadeus for Developers** - Flights, hotels

## Implementation Plan

### Week 1: Foundation
- [ ] Create Supabase schema (searches, search_results tables)
- [ ] Build /api/search/start endpoint
- [ ] Set up Vercel Workflow skeleton
- [ ] Create orchestrator agent

### Week 2: Search Agents
- [ ] Hotels agent with Google Places + RapidAPI
- [ ] Activities agent with Google Places + Viator
- [ ] Dining agent with Google Places

### Week 3: Aggregation & Mobile
- [ ] Aggregator agent with vibe matching
- [ ] Mobile app integration
- [ ] Real-time updates via Supabase
- [ ] Results display UI

### Week 4: Polish
- [ ] Add affiliate tracking
- [ ] Caching layer for repeated searches
- [ ] Error handling & retries
- [ ] Performance optimization

## Environment Variables Needed

```env
# AI Gateway
AI_GATEWAY_API_KEY=

# Google Places
GOOGLE_PLACES_API_KEY=

# RapidAPI (Hotels/Travel)
RAPIDAPI_KEY=

# Viator (Optional - Phase 2)
VIATOR_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Mobile App Changes Needed

1. Update trip creation flow to call `/api/search/start`
2. Add loading/progress UI while search runs
3. Display results in new "Search Results" screen
4. Enable booking via in-app browser (affiliate links)
5. Save selected items to trip itinerary
