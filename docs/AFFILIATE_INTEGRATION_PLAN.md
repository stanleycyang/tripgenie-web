# TripGenie Affiliate Integration Plan

## Current State Analysis

### ✅ What's Working
- Vercel AI SDK with AI Gateway for LLM calls
- Zod schemas for structured output
- Multi-agent architecture
- Vercel Workflows for durable execution

### ❌ What's Missing
1. Real affiliate partner API integrations
2. Affiliate click tracking for commission attribution
3. Availability/pricing verification
4. Deep linking with partner IDs

---

## Recommended Architecture

### Hybrid AI + Real Data Approach

```
User Input
    ↓
[Orchestrator Agent] - Understands intent, creates plan
    ↓
[AI Planner] - Creates ideal itinerary structure
    ↓
┌───────────────────────────────────────┐
│  PARALLEL REAL DATA ENRICHMENT        │
├───────────────────────────────────────┤
│ [Viator API]      - Tours/Experiences │
│ [Booking.com API] - Hotels            │
│ [TripAdvisor]     - Reviews/Ratings   │
│ [Google Places]   - Locations/Hours   │
└───────────────────────────────────────┘
    ↓
[Aggregator Agent] - Combines AI plan + real data
    ↓
[Affiliate Link Generator] - Adds tracking IDs
    ↓
Final Itinerary with Bookable Links
```

---

## Affiliate Partner Integrations

### 1. Viator Partner API (Tours & Experiences)
**Why:** #1 experiences platform, 15-20% commission
**API:** https://developer.viator.com

```typescript
// Required env vars
VIATOR_API_KEY=xxx
VIATOR_PARTNER_ID=xxx

// Endpoints we'll use
GET /products/search - Search products by destination
GET /products/{productCode} - Get product details
GET /availability/check - Check availability
POST /bookings - Create booking (optional)

// Affiliate link format
https://www.viator.com/tours/{destination}/{product-name}/d{destinationId}-{productCode}?aid={PARTNER_ID}
```

### 2. Booking.com Affiliate Partner API
**Why:** Largest hotel inventory, 25-40% commission
**API:** https://developers.booking.com/

```typescript
// Required env vars
BOOKING_COM_USERNAME=xxx
BOOKING_COM_PASSWORD=xxx
BOOKING_COM_AFFILIATE_ID=xxx

// Endpoints
GET /autocomplete - Destination search
GET /hotels - Search hotels
GET /hotelAvailability - Check availability
GET /hotelDescription - Get details

// Affiliate link format
https://www.booking.com/hotel/{country}/{hotel-slug}.html?aid={AFFILIATE_ID}&label={TRACKING_ID}
```

### 3. GetYourGuide Partner API (Alternative to Viator)
**Why:** Strong in Europe, 8% commission
**API:** https://partner.getyourguide.com/

```typescript
// Required env vars
GETYOURGUIDE_API_KEY=xxx
GETYOURGUIDE_PARTNER_ID=xxx

// Affiliate link format
https://www.getyourguide.com/{activity-slug}?partner_id={PARTNER_ID}&cmp={TRACKING_ID}
```

### 4. TripAdvisor Content API (Reviews/Ratings)
**Why:** Trusted reviews, enhance credibility
**API:** https://developer-tripadvisor.com/

---

## Affiliate Click Tracking System

### Database Schema

```sql
-- Track all affiliate clicks for commission attribution
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  activity_id VARCHAR(255),
  
  -- Affiliate details
  partner VARCHAR(50) NOT NULL, -- 'viator', 'booking', 'getyourguide'
  product_id VARCHAR(255) NOT NULL,
  product_name TEXT,
  
  -- Tracking
  tracking_id VARCHAR(100) UNIQUE NOT NULL,
  click_url TEXT NOT NULL,
  referrer_url TEXT,
  
  -- Attribution
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP WITH TIME ZONE,
  commission_amount DECIMAL(10, 2),
  commission_currency VARCHAR(3) DEFAULT 'USD',
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(20),
  
  CONSTRAINT valid_partner CHECK (partner IN ('viator', 'booking', 'getyourguide', 'tripadvisor'))
);

CREATE INDEX idx_affiliate_clicks_user ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_tracking ON affiliate_clicks(tracking_id);
CREATE INDEX idx_affiliate_clicks_partner ON affiliate_clicks(partner, clicked_at);
```

### Click Tracking API

```typescript
// POST /api/affiliate/click
// Called before redirecting user to partner site

interface TrackClickRequest {
  tripId: string;
  activityId: string;
  partner: 'viator' | 'booking' | 'getyourguide';
  productId: string;
  productName: string;
}

interface TrackClickResponse {
  trackingId: string;
  redirectUrl: string;  // URL with affiliate + tracking params
}
```

### Conversion Webhook

```typescript
// POST /api/affiliate/webhook/:partner
// Called by partner when booking is completed

interface ConversionWebhook {
  trackingId: string;
  bookingId: string;
  bookingAmount: number;
  commissionAmount: number;
  currency: string;
}
```

---

## Implementation Plan

### Phase 1: Viator Integration (Week 1)
- [ ] Apply for Viator Partner API access
- [ ] Create `/lib/affiliates/viator.ts` client
- [ ] Update Activities Agent to use real Viator data
- [ ] Add affiliate tracking for Viator links
- [ ] Test end-to-end booking flow

### Phase 2: Booking.com Integration (Week 2)
- [ ] Apply for Booking.com Affiliate API access
- [ ] Create `/lib/affiliates/booking.ts` client
- [ ] Update Hotels Agent to use real Booking.com data
- [ ] Add affiliate tracking for hotel links
- [ ] Test hotel booking flow

### Phase 3: Tracking & Analytics (Week 3)
- [ ] Create affiliate_clicks table
- [ ] Build click tracking API
- [ ] Create analytics dashboard
- [ ] Set up conversion webhooks

### Phase 4: AI Enhancement (Week 4)
- [ ] AI ranks real results by vibe match
- [ ] AI generates personalized descriptions
- [ ] AI creates day-by-day narrative
- [ ] A/B test AI vs raw API results

---

## Revenue Projections

| Partner | Commission | Avg Booking | Revenue/Click |
|---------|-----------|-------------|---------------|
| Viator | 15-20% | $150 | $22-30 |
| Booking.com | 25-40% | $200/night | $50-80 |
| GetYourGuide | 8% | $100 | $8 |

**Example Trip Revenue:**
- 1 hotel booking (3 nights): $150-240 commission
- 3 activities: $45-90 commission
- **Total per trip: $195-330**

---

## Environment Variables Needed

```bash
# Viator
VIATOR_API_KEY=
VIATOR_PARTNER_ID=

# Booking.com
BOOKING_COM_USERNAME=
BOOKING_COM_PASSWORD=
BOOKING_COM_AFFILIATE_ID=

# GetYourGuide
GETYOURGUIDE_API_KEY=
GETYOURGUIDE_PARTNER_ID=

# TripAdvisor
TRIPADVISOR_API_KEY=

# Google Places (for location data)
GOOGLE_PLACES_API_KEY=

# Analytics
ANALYTICS_WEBHOOK_SECRET=
```

---

## File Structure

```
backend/lib/affiliates/
├── index.ts           # Exports all affiliate clients
├── viator.ts          # Viator Partner API client
├── booking.ts         # Booking.com Affiliate client
├── getyourguide.ts    # GetYourGuide client
├── tracking.ts        # Click tracking utilities
└── types.ts           # Shared types

backend/app/api/affiliate/
├── click/route.ts     # Track clicks before redirect
├── webhook/
│   ├── viator/route.ts
│   ├── booking/route.ts
│   └── getyourguide/route.ts
└── analytics/route.ts # Dashboard data
```
