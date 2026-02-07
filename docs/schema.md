# TripGenie Database Schema

This document describes the PostgreSQL database schema for TripGenie.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌───────────────┐
│   users     │       │    trips    │       │  itineraries  │
├─────────────┤       ├─────────────┤       ├───────────────┤
│ id (PK)     │◄──────│ user_id (FK)│       │ id (PK)       │
│ email       │       │ id (PK)     │◄──────│ trip_id (FK)  │
│ name        │       │ destination │       │ day_number    │
│ password_h  │       │ start_date  │       │ activities    │
│ created_at  │       │ end_date    │       │ notes         │
│ updated_at  │       │ budget      │       │ created_at    │
└─────────────┘       │ status      │       │ updated_at    │
       │              │ created_at  │       └───────────────┘
       │              │ updated_at  │
       │              └─────────────┘
       │
       │              ┌─────────────┐
       └──────────────│ preferences │
                      ├─────────────┤
                      │ id (PK)     │
                      │ user_id (FK)│
                      │ interests   │
                      │ travel_st   │
                      │ dietary_r   │
                      │ created_at  │
                      │ updated_at  │
                      └─────────────┘
```

## Tables

### Users

Stores user account information.

| Column        | Type                     | Constraints           | Description                    |
| ------------- | ------------------------ | --------------------- | ------------------------------ |
| id            | UUID                     | PRIMARY KEY, DEFAULT  | Unique identifier              |
| email         | VARCHAR(255)             | NOT NULL, UNIQUE      | User's email address           |
| name          | VARCHAR(255)             | NOT NULL              | User's display name            |
| password_hash | VARCHAR(255)             | NOT NULL              | Bcrypt hashed password         |
| created_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Account creation timestamp     |
| updated_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Last update timestamp          |

**Indexes:**
- `idx_users_email` on `email` - For fast email lookups during authentication

### Trips

Stores travel trip information.

| Column      | Type                     | Constraints              | Description                |
| ----------- | ------------------------ | ------------------------ | -------------------------- |
| id          | UUID                     | PRIMARY KEY, DEFAULT     | Unique identifier          |
| user_id     | UUID                     | NOT NULL, FK → users(id) | Owner of the trip          |
| destination | VARCHAR(500)             | NOT NULL                 | Trip destination           |
| start_date  | DATE                     | NOT NULL                 | Trip start date            |
| end_date    | DATE                     | NOT NULL                 | Trip end date              |
| budget      | DECIMAL(12,2)            | NULLABLE                 | Trip budget                |
| status      | trip_status (ENUM)       | DEFAULT 'draft'          | Trip status                |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()            | Creation timestamp         |
| updated_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()            | Last update timestamp      |

**Enum: trip_status**
- `draft` - Initial planning stage
- `planning` - Actively planning
- `booked` - Flights/hotels booked
- `in_progress` - Currently on the trip
- `completed` - Trip completed
- `cancelled` - Trip cancelled

**Constraints:**
- `valid_dates` - Ensures `end_date >= start_date`
- Foreign key cascades on user deletion

**Indexes:**
- `idx_trips_user_id` on `user_id` - For listing user's trips
- `idx_trips_status` on `status` - For filtering by status
- `idx_trips_dates` on `(start_date, end_date)` - For date range queries

### Itineraries

Stores daily itinerary for each trip.

| Column     | Type                     | Constraints               | Description                     |
| ---------- | ------------------------ | ------------------------- | ------------------------------- |
| id         | UUID                     | PRIMARY KEY, DEFAULT      | Unique identifier               |
| trip_id    | UUID                     | NOT NULL, FK → trips(id)  | Parent trip                     |
| day_number | INTEGER                  | NOT NULL                  | Day number (1, 2, 3, etc.)      |
| activities | JSONB                    | NOT NULL, DEFAULT '[]'    | Array of activities             |
| notes      | TEXT                     | NULLABLE                  | Day notes                       |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()             | Creation timestamp              |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()             | Last update timestamp           |

**Constraints:**
- `unique_trip_day` - Ensures unique day per trip (trip_id, day_number)
- `positive_day_number` - Ensures day_number > 0
- Foreign key cascades on trip deletion

**Activities JSON Structure:**
```json
[
  {
    "time": "09:00",
    "title": "Visit Tokyo Tower",
    "description": "Iconic landmark with observation decks",
    "location": "4 Chome-2-8 Shibakoen, Minato City",
    "duration_minutes": 120,
    "cost": 25,
    "category": "sightseeing"
  }
]
```

**Indexes:**
- `idx_itineraries_trip_id` on `trip_id` - For listing trip's itineraries

### Preferences

Stores user travel preferences for AI-powered recommendations.

| Column               | Type                     | Constraints                     | Description                    |
| -------------------- | ------------------------ | ------------------------------- | ------------------------------ |
| id                   | UUID                     | PRIMARY KEY, DEFAULT            | Unique identifier              |
| user_id              | UUID                     | NOT NULL, FK → users(id), UNIQUE| User reference (one per user)  |
| interests            | TEXT[]                   | DEFAULT '{}'                    | Array of interests             |
| travel_style         | travel_style (ENUM)      | NULLABLE                        | Preferred travel style         |
| dietary_restrictions | TEXT[]                   | DEFAULT '{}'                    | Array of dietary restrictions  |
| created_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                   | Creation timestamp             |
| updated_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                   | Last update timestamp          |

**Enum: travel_style**
- `budget` - Budget-conscious travel
- `mid_range` - Moderate spending
- `luxury` - High-end travel
- `backpacker` - Adventure/backpacking style
- `business` - Business travel

**Example Interests:**
- "hiking", "museums", "food tours", "photography", "beaches", "history", "nightlife"

**Example Dietary Restrictions:**
- "vegetarian", "vegan", "gluten-free", "halal", "kosher", "nut allergy"

**Indexes:**
- `idx_preferences_user_id` on `user_id` - For user preferences lookup

## Triggers

### update_updated_at_column()

Automatically updates the `updated_at` column when a row is modified.

Applied to all tables:
- `update_users_updated_at`
- `update_trips_updated_at`
- `update_itineraries_updated_at`
- `update_preferences_updated_at`

## Extensions

### uuid-ossp

Provides UUID generation functions. Used for generating primary keys.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Migrations

Migrations are stored in the `migrations/` directory and tracked in the `migrations` table.

| Column      | Type                     | Description                    |
| ----------- | ------------------------ | ------------------------------ |
| id          | SERIAL                   | Migration sequence number      |
| name        | VARCHAR(255)             | Migration filename             |
| executed_at | TIMESTAMP WITH TIME ZONE | When migration was run         |

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration (requires .down.sql file)
npm run migrate:down
```

## Sample Queries

### Get all trips for a user with upcoming dates

```sql
SELECT * FROM trips
WHERE user_id = 'user-uuid'
  AND start_date >= CURRENT_DATE
  AND status NOT IN ('completed', 'cancelled')
ORDER BY start_date ASC;
```

### Get trip with full itinerary

```sql
SELECT 
  t.*,
  json_agg(
    json_build_object(
      'day_number', i.day_number,
      'activities', i.activities,
      'notes', i.notes
    ) ORDER BY i.day_number
  ) as itinerary
FROM trips t
LEFT JOIN itineraries i ON i.trip_id = t.id
WHERE t.id = 'trip-uuid'
GROUP BY t.id;
```

### Get user with preferences

```sql
SELECT 
  u.id, u.email, u.name, u.created_at,
  p.interests, p.travel_style, p.dietary_restrictions
FROM users u
LEFT JOIN preferences p ON p.user_id = u.id
WHERE u.id = 'user-uuid';
```

## Future Considerations

1. **Full-text Search** - Add `tsvector` columns for searching destinations and activities
2. **Geospatial** - Add PostGIS for location-based queries
3. **Soft Deletes** - Add `deleted_at` column for data recovery
4. **Audit Log** - Track changes with an audit table
5. **Bookmarks/Favorites** - Save favorite destinations or activities
6. **Sharing** - Allow trips to be shared between users
