/**
 * Streaming Generative UI API Route
 *
 * POST /api/itinerary/stream-ui
 *
 * Accepts trip preferences and streams back a json-render spec that the
 * client compiles incrementally into a live component tree. This gives
 * users immediate visual feedback rather than waiting for the full
 * itinerary to be generated.
 *
 * The response is a plain text stream of JSON — the client uses
 * createSpecStreamCompiler to turn partial chunks into a renderable spec.
 */

import { NextRequest } from 'next/server';
import { streamItinerarySpec } from '@/lib/json-render/stream';
import type { TripPreferences } from '@/lib/ai/types';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const preferences: TripPreferences = {
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      budget: body.budget || 'moderate',
      vibes: body.vibes || ['adventure'],
      travelers: body.travelers || { adults: 1, children: 0 },
      interests: body.interests || [],
      dietaryRestrictions: body.dietaryRestrictions || [],
      mobilityNeeds: body.mobilityNeeds,
    };

    if (!preferences.destination || !preferences.startDate || !preferences.endDate) {
      return Response.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 },
      );
    }

    const result = await streamItinerarySpec(preferences, {
      model: body.model,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[Stream UI Error]', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 },
    );
  }
}
