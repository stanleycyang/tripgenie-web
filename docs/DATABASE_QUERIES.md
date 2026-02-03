# TripGenie Database Query Reference

Quick reference for common database operations in TripGenie.

## Table of Contents
- [User Operations](#user-operations)
- [Trip Operations](#trip-operations)
- [Itinerary Operations](#itinerary-operations)
- [Saved Activities](#saved-activities)
- [Aggregations & Analytics](#aggregations--analytics)
- [Advanced Queries](#advanced-queries)

---

## User Operations

### Get Current User Profile
```typescript
const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Update User Subscription Tier
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ subscription_tier: 'pro' })
  .eq('id', user.id)
  .select()
  .single()
```

### Get User Stats
```sql
SELECT 
  u.*,
  COUNT(DISTINCT t.id) as total_trips,
  COUNT(DISTINCT i.id) as trips_with_itinerary,
  COUNT(DISTINCT sa.id) as total_saved_activities
FROM users u
LEFT JOIN trips t ON t.user_id = u.id
LEFT JOIN itineraries i ON i.trip_id = t.id
LEFT JOIN saved_activities sa ON sa.trip_id = t.id
WHERE u.id = auth.uid()
GROUP BY u.id;
```

---

## Trip Operations

### Create a Trip
```typescript
const { data: trip, error } = await supabase
  .from('trips')
  .insert({
    user_id: user.id,
    destination: 'Paris, France',
    start_date: '2026-07-01',
    end_date: '2026-07-07',
    travelers: 2,
    budget: 3500.00,
    preferences: {
      activities: ['museums', 'dining', 'sightseeing'],
      accommodation: 'hotel',
      pace: 'relaxed',
      transport: 'public'
    }
  })
  .select()
  .single()
```

### Get All User Trips
```typescript
const { data: trips } = await supabase
  .from('trips')
  .select(`
    *,
    itineraries(id, total_cost_estimate, generated_at),
    saved_activities(count)
  `)
  .order('start_date', { ascending: false })
```

### Get Upcoming Trips
```typescript
const { data: upcomingTrips } = await supabase
  .from('trips')
  .select('*')
  .gte('start_date', new Date().toISOString().split('T')[0])
  .order('start_date', { ascending: true })
```

### Get Past Trips
```typescript
const { data: pastTrips } = await supabase
  .from('trips')
  .select('*')
  .lt('end_date', new Date().toISOString().split('T')[0])
  .order('start_date', { ascending: false })
```

### Update Trip
```typescript
const { data, error } = await supabase
  .from('trips')
  .update({ 
    budget: 4000.00,
    preferences: {
      ...existingPreferences,
      activities: ['museums', 'dining', 'nightlife']
    }
  })
  .eq('id', tripId)
  .select()
  .single()
```

### Delete Trip (Cascades to itineraries and activities)
```typescript
const { error } = await supabase
  .from('trips')
  .delete()
  .eq('id', tripId)
```

### Search Trips by Destination
```typescript
const { data } = await supabase
  .from('trips')
  .select('*')
  .ilike('destination', '%tokyo%')
  .order('created_at', { ascending: false })
```

---

## Itinerary Operations

### Create Itinerary for Trip
```typescript
const { data: itinerary, error } = await supabase
  .from('itineraries')
  .insert({
    trip_id: tripId,
    days_data: [
      {
        day: 1,
        date: '2026-07-01',
        activities: [
          {
            time: '09:00',
            title: 'Eiffel Tower Visit',
            description: 'Visit the iconic Eiffel Tower',
            cost: 28.00,
            location: 'Champ de Mars, Paris',
            duration: '2 hours'
          },
          {
            time: '14:00',
            title: 'Louvre Museum',
            description: 'Explore world-famous art collection',
            cost: 17.00,
            location: 'Rue de Rivoli, Paris',
            duration: '3 hours'
          }
        ]
      },
      {
        day: 2,
        date: '2026-07-02',
        activities: [
          // Day 2 activities...
        ]
      }
    ],
    ai_model_used: 'claude-3-5-sonnet-20241022',
    total_cost_estimate: 2800.00
  })
  .select()
  .single()
```

### Get Trip with Itinerary
```typescript
const { data } = await supabase
  .from('trips')
  .select(`
    *,
    itineraries (
      id,
      days_data,
      generated_at,
      ai_model_used,
      total_cost_estimate
    )
  `)
  .eq('id', tripId)
  .single()
```

### Update Itinerary
```typescript
const { data, error } = await supabase
  .from('itineraries')
  .update({ 
    days_data: updatedDaysData,
    total_cost_estimate: newTotal
  })
  .eq('trip_id', tripId)
  .select()
  .single()
```

### Regenerate Itinerary (Delete and Create New)
```typescript
// Delete existing
await supabase
  .from('itineraries')
  .delete()
  .eq('trip_id', tripId)

// Create new
const { data } = await supabase
  .from('itineraries')
  .insert({ /* new itinerary data */ })
  .select()
  .single()
```

---

## Saved Activities

### Save an Activity
```typescript
const { data, error } = await supabase
  .from('saved_activities')
  .insert({
    trip_id: tripId,
    activity_name: 'Seine River Cruise',
    description: 'Evening cruise along the Seine with dinner',
    time_slot: 'Evening (7:00 PM)',
    cost: 85.00,
    booking_url: 'https://example.com/seine-cruise'
  })
  .select()
  .single()
```

### Get All Saved Activities for Trip
```typescript
const { data: activities } = await supabase
  .from('saved_activities')
  .select('*')
  .eq('trip_id', tripId)
  .order('created_at', { ascending: true })
```

### Update Saved Activity
```typescript
const { data, error } = await supabase
  .from('saved_activities')
  .update({ 
    time_slot: 'Morning (9:00 AM)',
    cost: 75.00
  })
  .eq('id', activityId)
  .select()
  .single()
```

### Delete Saved Activity
```typescript
const { error } = await supabase
  .from('saved_activities')
  .delete()
  .eq('id', activityId)
```

---

## Aggregations & Analytics

### Get Total Spending Across All Trips
```sql
SELECT 
  SUM(total_cost_estimate) as total_spent
FROM itineraries i
JOIN trips t ON t.id = i.trip_id
WHERE t.user_id = auth.uid();
```

### Average Trip Budget by Destination
```sql
SELECT 
  destination,
  COUNT(*) as trip_count,
  AVG(budget) as avg_budget,
  AVG(travelers) as avg_travelers
FROM trips
WHERE user_id = auth.uid()
GROUP BY destination
ORDER BY trip_count DESC;
```

### Most Popular Activities (From Saved Activities)
```sql
SELECT 
  activity_name,
  COUNT(*) as times_saved,
  AVG(cost) as avg_cost
FROM saved_activities sa
JOIN trips t ON t.id = sa.trip_id
WHERE t.user_id = auth.uid()
GROUP BY activity_name
ORDER BY times_saved DESC
LIMIT 10;
```

### Trips by Month (Travel Frequency)
```sql
SELECT 
  DATE_TRUNC('month', start_date) as month,
  COUNT(*) as trip_count
FROM trips
WHERE user_id = auth.uid()
GROUP BY month
ORDER BY month DESC;
```

---

## Advanced Queries

### Get Trip with Full Details (TypeScript)
```typescript
const { data: tripDetails } = await supabase
  .from('trips')
  .select(`
    id,
    destination,
    start_date,
    end_date,
    travelers,
    budget,
    preferences,
    itineraries (
      id,
      days_data,
      generated_at,
      ai_model_used,
      total_cost_estimate
    ),
    saved_activities (
      id,
      activity_name,
      description,
      time_slot,
      cost,
      booking_url
    )
  `)
  .eq('id', tripId)
  .single()
```

### Search Trips by Preference (JSONB Query)
```typescript
// Find all trips where user likes 'museums'
const { data } = await supabase
  .from('trips')
  .select('*')
  .contains('preferences', { activities: ['museums'] })
```

### Filter by Budget Range
```typescript
const { data } = await supabase
  .from('trips')
  .select('*')
  .gte('budget', 1000)
  .lte('budget', 5000)
  .order('budget', { ascending: true })
```

### Get Trips with Days Calculation
```sql
SELECT 
  *,
  (end_date - start_date) as duration_days,
  CASE 
    WHEN (end_date - start_date) <= 3 THEN 'short'
    WHEN (end_date - start_date) <= 7 THEN 'medium'
    ELSE 'long'
  END as trip_type
FROM trips
WHERE user_id = auth.uid()
ORDER BY start_date DESC;
```

### Budget vs Actual Cost Analysis
```sql
SELECT 
  t.destination,
  t.budget as planned_budget,
  i.total_cost_estimate as estimated_cost,
  (t.budget - i.total_cost_estimate) as budget_difference,
  ROUND(((i.total_cost_estimate / t.budget) * 100)::numeric, 2) as budget_utilization_percent
FROM trips t
JOIN itineraries i ON i.trip_id = t.id
WHERE t.user_id = auth.uid()
ORDER BY t.start_date DESC;
```

---

## Useful PostgreSQL Functions

### Count Activities in Itinerary
```sql
SELECT 
  t.destination,
  jsonb_array_length(i.days_data) as num_days,
  (
    SELECT SUM(jsonb_array_length(day->'activities'))
    FROM jsonb_array_elements(i.days_data) as day
  ) as total_activities
FROM trips t
JOIN itineraries i ON i.trip_id = t.id
WHERE t.user_id = auth.uid();
```

### Extract Specific Day from Itinerary
```sql
SELECT 
  t.destination,
  day->>'date' as date,
  day->'activities' as activities
FROM trips t
JOIN itineraries i ON i.trip_id = t.id,
jsonb_array_elements(i.days_data) as day
WHERE t.id = '<trip-id>'
  AND (day->>'day')::int = 1;  -- Get day 1
```

---

## Transaction Examples

### Create Trip with Itinerary (Multiple Inserts)
```typescript
// Start transaction using RPC function (need to create this)
const { data: trip } = await supabase
  .from('trips')
  .insert({ /* trip data */ })
  .select()
  .single()

if (trip) {
  const { data: itinerary } = await supabase
    .from('itineraries')
    .insert({ 
      trip_id: trip.id,
      /* itinerary data */
    })
    .select()
    .single()
}
```

---

## Performance Tips

### Use Indexes (Already Created)
- `idx_trips_user_id` - Fast user trip lookups
- `idx_trips_start_date` - Fast date range queries
- `idx_itineraries_trip_id` - Fast itinerary joins

### Limit Large Queries
```typescript
const { data } = await supabase
  .from('trips')
  .select('*')
  .limit(20)  // Pagination
  .range(0, 19)  // First page
```

### Use `.single()` When Expecting One Result
```typescript
// Better performance than .limit(1)
const { data } = await supabase
  .from('trips')
  .select('*')
  .eq('id', tripId)
  .single()  // Expects exactly one result
```

---

## Common Errors & Solutions

### "duplicate key value violates unique constraint"
- Trying to insert duplicate unique value (e.g., email)
- Check for existing records first

### "insert or update on table violates foreign key constraint"
- Referenced record doesn't exist (e.g., invalid user_id or trip_id)
- Verify parent record exists

### "new row violates row-level security policy"
- RLS policy blocking the operation
- Ensure `auth.uid()` matches `user_id`
- Check if user is authenticated

### "invalid input syntax for type uuid"
- Passing invalid UUID format
- Use proper UUID validation

---

## Resources

- [Supabase JS Reference](https://supabase.com/docs/reference/javascript)
- [PostgreSQL JSONB Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Note**: All queries above respect RLS policies and only return data belonging to the authenticated user.
