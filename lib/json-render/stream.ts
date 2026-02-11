/**
 * TripGenie json-render Streaming Utilities
 *
 * - Builds prompts that instruct the AI to return a json-render spec
 * - Provides a streaming client that compiles partial JSON chunks into
 *   an incrementally-renderable spec tree using SpecStreamCompiler
 */

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { TripPreferences } from '../ai/types';
import { catalogPrompt } from './catalog';

// AI Gateway config (mirrors lib/ai/client.ts)
const aiGateway = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

const DEFAULT_MODEL = 'anthropic/claude-sonnet-4-20250514';

// ── System prompt ──────────────────────────────────────────────────────
const SPEC_SYSTEM_PROMPT = `You are Claude, an expert travel planning AI for TripGenie.

Your job is to generate a personalized travel itinerary and return it as a
json-render UI spec — a JSON tree of component nodes that the frontend will
render incrementally as you stream the response.

## AVAILABLE COMPONENTS

${catalogPrompt}

## OUTPUT FORMAT

Return ONLY a valid JSON object (no markdown fences, no commentary) with this
top-level shape:

{
  "root": {
    "type": "<ComponentName>",
    "props": { ... },
    "children": [ ... ]
  }
}

Each node in the tree is:
{
  "type": "<ComponentName>",
  "props": { <matching the component schema> },
  "children": [ <child nodes> ]   // optional
}

## RULES

1. The root node MUST be a Section with title "Day-by-Day Itinerary".
2. First child of root should be a TripOverview.
3. Then one ItineraryDay per day. Inside each ItineraryDay, place TimeBlock
   children for morning, afternoon, and evening.
4. Inside each TimeBlock, place ActivityCard and RestaurantCard nodes.
5. After all days, add a TipsList for general travel tips and a PackingList.
6. Include realistic cost estimates, durations (minutes), and vibe-match data.
7. Balance popular attractions with local gems.
8. Stream the JSON incrementally — start outputting immediately, don't buffer.
9. Make sure JSON is valid. No trailing commas.
`;

// ── Prompt builder ─────────────────────────────────────────────────────
export function buildSpecPrompt(preferences: TripPreferences): string {
  const {
    destination,
    startDate,
    endDate,
    budget,
    vibes,
    travelers,
    interests,
    dietaryRestrictions,
    mobilityNeeds,
  } = preferences;

  const days =
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  return `Generate a complete ${days}-day travel itinerary UI spec for ${destination}.

TRAVELER PROFILE:
- Dates: ${startDate} to ${endDate} (${days} days)
- Budget level: ${budget}
- Travelers: ${travelers.adults} adult(s), ${travelers.children} child(ren)
- Vibes: ${vibes.join(', ')}
${interests && interests.length > 0 ? `- Interests: ${interests.join(', ')}` : ''}
${dietaryRestrictions && dietaryRestrictions.length > 0 ? `- Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${mobilityNeeds ? `- Mobility needs: ${mobilityNeeds}` : ''}

Generate the full json-render spec now. Start streaming immediately.`;
}

// ── Server-side streaming function ─────────────────────────────────────
export async function streamItinerarySpec(
  preferences: TripPreferences,
  options?: { model?: string },
) {
  const modelName = options?.model || DEFAULT_MODEL;
  const prompt = buildSpecPrompt(preferences);

  return streamText({
    model: aiGateway(modelName),
    system: SPEC_SYSTEM_PROMPT,
    prompt,
  });
}
