# TripGenie Backend

Next.js 15 backend for TripGenie - AI-powered travel planning platform.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── trips/
│   │   │   ├── route.ts              # GET/POST /api/trips
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET/PUT/DELETE /api/trips/[id]
│   │   │       └── generate/
│   │   │           └── route.ts      # POST /api/trips/[id]/generate
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts          # OAuth callback handler
│   ├── (marketing)/
│   │   └── page.tsx                  # Landing page
│   ├── (app)/
│   │   └── dashboard/
│   │       └── page.tsx              # Dashboard page
│   └── layout.tsx                    # Root layout
├── lib/
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client
└── components/                       # Shared React components

```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Routes

### Trips

- `GET /api/trips` - Fetch all trips for authenticated user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/[id]` - Fetch a specific trip
- `PUT /api/trips/[id]` - Update a trip
- `DELETE /api/trips/[id]` - Delete a trip
- `POST /api/trips/[id]/generate` - Generate AI itinerary for a trip

### Authentication

- `GET /api/auth/callback` - OAuth callback handler

## Next Steps

1. Set up Supabase database schema
2. Implement AI integration (OpenAI/Anthropic)
3. Add authentication UI
4. Build trip creation/editing forms
5. Implement real-time updates
6. Add file uploads for trip photos

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```
