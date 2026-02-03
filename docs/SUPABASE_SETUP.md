# TripGenie Supabase Setup Guide

## Overview

TripGenie uses Supabase for:
- **PostgreSQL Database** - Store users, trips, itineraries, and activities
- **Authentication** - Google OAuth, Apple Sign-In, and Email/Password
- **Row Level Security (RLS)** - Secure data access at the database level
- **Real-time capabilities** - Future feature for collaborative trip planning

## Project Details

- **Project Name**: `tripgenie-prod`
- **Region**: US West (California)
- **Plan**: Free tier (expandable to Pro as needed)
- **Database**: PostgreSQL 15+

## Database Schema

### Tables

#### 1. **users**
Stores user profile information (auto-created from auth.users via trigger).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Matches auth.users.id |
| `email` | TEXT | UNIQUE, NOT NULL | User email address |
| `auth_provider` | TEXT | NOT NULL | google, apple, or email |
| `subscription_tier` | TEXT | DEFAULT 'free' | free, pro, or premium |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**: `idx_users_email`, `idx_users_created_at`

#### 2. **trips**
Stores trip information created by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique trip identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | Trip owner |
| `destination` | TEXT | NOT NULL | Travel destination |
| `start_date` | DATE | NOT NULL | Trip start date |
| `end_date` | DATE | NOT NULL | Trip end date |
| `travelers` | INTEGER | DEFAULT 1, > 0 | Number of travelers |
| `budget` | DECIMAL(10,2) | | Total budget in USD |
| `preferences` | JSONB | DEFAULT '{}' | User preferences (activities, pace, etc.) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Constraints**: `end_date >= start_date`

**Indexes**: `idx_trips_user_id`, `idx_trips_start_date`, `idx_trips_created_at`

#### 3. **itineraries**
Stores AI-generated itineraries for trips.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique itinerary identifier |
| `trip_id` | UUID | FOREIGN KEY → trips(id), UNIQUE | One itinerary per trip |
| `days_data` | JSONB | DEFAULT '[]' | Array of daily activities |
| `generated_at` | TIMESTAMPTZ | DEFAULT NOW() | Generation timestamp |
| `ai_model_used` | TEXT | | AI model name (e.g., claude-3-5-sonnet) |
| `total_cost_estimate` | DECIMAL(10,2) | | Estimated total cost |

**Indexes**: `idx_itineraries_trip_id`, `idx_itineraries_generated_at`

**days_data JSON structure**:
```json
[
  {
    "day": 1,
    "date": "2026-06-01",
    "activities": [
      {
        "time": "09:00",
        "title": "Activity name",
        "description": "Activity details",
        "cost": 50.00,
        "location": "Address or coords"
      }
    ]
  }
]
```

#### 4. **saved_activities**
Stores user-saved activities for future trips.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique activity identifier |
| `trip_id` | UUID | FOREIGN KEY → trips(id) | Associated trip |
| `activity_name` | TEXT | NOT NULL | Activity name |
| `description` | TEXT | | Activity description |
| `time_slot` | TEXT | | Preferred time (e.g., "Morning") |
| `cost` | DECIMAL(10,2) | | Activity cost |
| `booking_url` | TEXT | | Booking/info URL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**: `idx_saved_activities_trip_id`, `idx_saved_activities_created_at`

## Row Level Security (RLS)

All tables have RLS enabled. Policies ensure users can only access their own data.

### Users Table Policies
- Users can view, update, and insert their own profile
- Profile auto-created on signup via trigger

### Trips Table Policies
- Users can SELECT, INSERT, UPDATE, DELETE their own trips
- `auth.uid() = user_id` enforces ownership

### Itineraries Table Policies
- Users can access itineraries for their trips
- Policies check trip ownership via JOIN

### Saved Activities Table Policies
- Users can access saved activities for their trips
- Policies check trip ownership via JOIN

## Authentication Setup

### Providers Enabled
1. **Google OAuth**
   - Client ID and Secret configured
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://tripgenie.app/auth/callback`

2. **Apple Sign-In**
   - Services ID, Team ID, Key ID configured
   - Redirect URLs: Same as Google

3. **Email/Password**
   - Email confirmation enabled
   - Password requirements: min 8 characters

### Auth Trigger
Automatically creates a user profile in `users` table when a new user signs up:

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

## Installation & Setup

### 1. Install Dependencies (already done)
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Create Supabase Project
Visit [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project:
- Name: `tripgenie-prod`
- Region: US West
- Database Password: (save to 1Password)

### 3. Run Migrations
```bash
# Using Supabase CLI
cd backend
supabase db push

# Or manually via SQL Editor in Supabase dashboard
# Copy contents of supabase/migrations/20260202_init_schema.sql
```

### 4. Configure Environment Variables
Update `backend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from: Supabase Dashboard → Project Settings → API

### 5. Configure Authentication
In Supabase Dashboard → Authentication → Providers:

**Google OAuth:**
1. Create OAuth app in [Google Cloud Console](https://console.cloud.google.com)
2. Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase

**Apple Sign-In:**
1. Create Services ID in [Apple Developer](https://developer.apple.com)
2. Configure return URLs
3. Generate private key
4. Add credentials to Supabase

**Email/Password:**
- Already enabled by default
- Configure email templates in Authentication → Email Templates

### 6. Set Site URL
In Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (development)
- Redirect URLs: 
  - `http://localhost:3000/auth/callback`
  - `https://tripgenie.app/auth/callback` (production)

## Testing

### Run the Test Script
```bash
cd backend
npm install -g tsx  # If not already installed
npx tsx scripts/test-supabase.ts
```

This will:
1. ✅ Test database connection
2. ✅ Create a test user (auto-creates profile via trigger)
3. ✅ Create a test trip
4. ✅ Verify RLS policies block unauthorized access
5. ✅ Create test itinerary and saved activity
6. 🧹 Clean up test data

### Expected Output
```
╔════════════════════════════════════════════╗
║   TripGenie Supabase Connection Test      ║
╚════════════════════════════════════════════╝

🔍 Testing Supabase connection...
✅ Database connection successful!

🔍 Testing user creation...
✅ Auth user created: 12345678-1234-1234-1234-123456789abc
✅ User profile created automatically via trigger
   Email: test-1709876543210@tripgenie.test
   Auth Provider: email
   Subscription Tier: free

🔍 Testing trip creation and RLS...
✅ Trip created successfully
   Trip ID: 87654321-4321-4321-4321-cba987654321
   Destination: Tokyo, Japan
   Dates: 2026-06-01 to 2026-06-07
✅ RLS working: Anonymous client cannot read user trips

🔍 Testing itinerary creation...
✅ Itinerary created successfully
   Itinerary ID: abcdef12-3456-7890-abcd-ef1234567890
   Days: 1
   Total Cost: 4500.00

🔍 Testing saved activities...
✅ Saved activity created successfully
   Activity: TeamLab Borderless
   Cost: 35.00
   Booking URL: https://borderless.teamlab.art/

🧹 Cleaning up test data...
✅ Test data cleaned up successfully

╔════════════════════════════════════════════╗
║       ✅ All tests passed!                 ║
╚════════════════════════════════════════════╝
```

## Usage in API Routes

### Server-Side (API Routes, Server Components)
```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // RLS automatically filters for user's trips
  const { data: trips, error } = await supabase
    .from('trips')
    .select('*, itineraries(*)')
    .order('created_at', { ascending: false })
  
  return Response.json({ trips })
}
```

### Client-Side (React Components)
```typescript
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function TripsList() {
  const [trips, setTrips] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    async function loadTrips() {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      
      setTrips(data || [])
    }
    
    loadTrips()
  }, [])
  
  return (
    <div>
      {trips.map(trip => (
        <div key={trip.id}>{trip.destination}</div>
      ))}
    </div>
  )
}
```

## Migrations

### Creating New Migrations
```bash
# Create a new migration file
supabase migration new add_feature_name

# Edit the migration file in supabase/migrations/
# Example: 20260203_add_feature_name.sql
```

### Running Migrations
```bash
# Apply pending migrations
supabase db push

# Or using Supabase dashboard SQL Editor
# Copy and paste migration SQL
```

### Migration Best Practices
1. **Always test migrations locally first**
2. **Use transactions for multiple changes**
3. **Include rollback instructions in comments**
4. **Never modify existing migrations** - create new ones
5. **Keep migrations small and focused**

## Security Considerations

### RLS Policies
- **Never bypass RLS in production** - use service role key only for admin operations
- Test policies thoroughly to prevent data leaks
- Use `auth.uid()` to check authenticated user

### API Keys
- **ANON KEY**: Safe to use in browser, respects RLS
- **SERVICE ROLE KEY**: Bypasses RLS, NEVER expose to client
- Store service role key in environment variables only

### Authentication
- Enable email confirmation for email/password signups
- Set up proper OAuth redirect URLs
- Use HTTPS in production

## Troubleshooting

### Connection Issues
```bash
# Test connection with psql
psql "postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"

# Check Supabase CLI connection
supabase db remote commit
```

### RLS Issues
- Check policies in Supabase Dashboard → Database → Policies
- Use "Test policy" feature in dashboard
- Ensure `auth.uid()` matches user_id in your queries

### Migration Errors
- Check PostgreSQL logs in Supabase Dashboard → Database → Logs
- Verify foreign key relationships
- Ensure proper column types and constraints

## Useful Queries

### Check User's Trips
```sql
SELECT 
  t.id,
  t.destination,
  t.start_date,
  t.end_date,
  i.total_cost_estimate,
  COUNT(sa.id) as saved_activities_count
FROM trips t
LEFT JOIN itineraries i ON i.trip_id = t.id
LEFT JOIN saved_activities sa ON sa.trip_id = t.id
WHERE t.user_id = auth.uid()
GROUP BY t.id, i.total_cost_estimate
ORDER BY t.created_at DESC;
```

### Get Trip with Full Details
```sql
SELECT 
  t.*,
  json_build_object(
    'id', i.id,
    'days_data', i.days_data,
    'total_cost', i.total_cost_estimate,
    'ai_model', i.ai_model_used
  ) as itinerary,
  json_agg(
    json_build_object(
      'id', sa.id,
      'name', sa.activity_name,
      'cost', sa.cost
    )
  ) as saved_activities
FROM trips t
LEFT JOIN itineraries i ON i.trip_id = t.id
LEFT JOIN saved_activities sa ON sa.trip_id = t.id
WHERE t.id = 'trip-uuid-here'
GROUP BY t.id, i.id;
```

## Next Steps

1. ✅ Database schema created
2. ✅ RLS policies implemented
3. ✅ Auth providers configured
4. ⏳ Implement API routes (`/api/trips`, `/api/itineraries`)
5. ⏳ Create frontend components
6. ⏳ Integrate AI itinerary generation
7. ⏳ Add real-time collaboration features

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

**Questions?** Check the Supabase dashboard logs or reach out to the team.
