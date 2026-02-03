# TripGenie API Endpoints

## Authentication & Security

All endpoints use the following security measures:
- **JWT Authentication** via Supabase Auth
- **Row Level Security (RLS)** on all database tables
- **Rate Limiting** (recommended: implement via Vercel middleware)
- **Input Validation** via Zod schemas

### Auth Header
```
Authorization: Bearer <supabase_access_token>
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Email/password signup |
| POST | `/api/auth/login` | No | Email/password login |
| GET | `/api/auth/callback` | No | OAuth callback (Google/Apple) |
| POST | `/api/auth/logout` | Yes | Logout and invalidate session |
| POST | `/api/auth/refresh` | Yes | Refresh access token |
| POST | `/api/auth/reset-password` | No | Request password reset |

### User Profile

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/user/profile` | Yes | Get current user profile |
| PATCH | `/api/user/profile` | Yes | Update user profile |
| DELETE | `/api/user/account` | Yes | Delete user account |
| GET | `/api/user/preferences` | Yes | Get travel preferences |
| PUT | `/api/user/preferences` | Yes | Update travel preferences |

### Trips

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/trips` | Yes | List user's trips |
| POST | `/api/trips` | Yes | Create new trip |
| GET | `/api/trips/[id]` | Yes | Get trip details |
| PATCH | `/api/trips/[id]` | Yes | Update trip |
| DELETE | `/api/trips/[id]` | Yes | Delete trip |
| POST | `/api/trips/[id]/generate` | Yes | Generate AI itinerary |

### Search (AI-Powered)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/search/start` | Optional | Start travel search |
| GET | `/api/search/[id]` | Optional | Get search status/results |
| GET | `/api/search/history` | Yes | Get user's search history |

### Bookings (Affiliate)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/bookings/hotels/search` | Optional | Search hotels via affiliate |
| GET | `/api/bookings/hotels/[id]` | Optional | Get hotel details |
| POST | `/api/bookings/hotels/[id]/book` | Yes | Redirect to booking |
| POST | `/api/bookings/activities/search` | Optional | Search activities |
| GET | `/api/bookings/activities/[id]` | Optional | Get activity details |
| POST | `/api/bookings/activities/[id]/book` | Yes | Redirect to booking |
| POST | `/api/bookings/restaurants/search` | Optional | Search restaurants |
| GET | `/api/bookings/restaurants/[id]` | Optional | Get restaurant details |
| POST | `/api/bookings/restaurants/[id]/reserve` | Yes | Make reservation |

### Tracking & Analytics

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/track/click` | No | Track affiliate click |
| POST | `/api/track/conversion` | No | Webhook for conversions |

---

## Request/Response Examples

### Start Search
```bash
POST /api/search/start
Content-Type: application/json

{
  "destination": "Tokyo",
  "startDate": "2026-03-01",
  "endDate": "2026-03-05",
  "travelers": 2,
  "travelerType": "couple",
  "vibes": ["Cultural", "Foodie"],
  "budget": "moderate"
}

Response:
{
  "searchId": "uuid",
  "status": "started",
  "estimatedTime": 30
}
```

### Get Search Results
```bash
GET /api/search/{searchId}

Response:
{
  "searchId": "uuid",
  "status": "completed",
  "progress": {
    "orchestrator": "done",
    "hotels": "done",
    "activities": "done",
    "dining": "done",
    "aggregator": "done"
  },
  "results": {
    "hotels": [...],
    "activities": [...],
    "dining": [...],
    "itinerary": [...]
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | No permission for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
