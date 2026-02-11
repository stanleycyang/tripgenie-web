/**
 * TripGenie json-render Catalog
 *
 * Defines all available UI components and actions that the AI model
 * can use when generating itinerary specs. Each component has a Zod
 * schema for its props so the AI output is validated at runtime.
 *
 * @see https://github.com/vercel-labs/json-render
 */

import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react';
import { z } from 'zod';

export const tripCatalog = defineCatalog(schema, {
  components: {
    // ── Top-level wrappers ──────────────────────────────────────────
    TripOverview: {
      props: z.object({
        destination: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        overview: z.string(),
        totalCost: z.number().optional(),
        currency: z.string().optional(),
      }),
      description:
        'Hero section showing destination name, date range, short overview blurb, and total estimated cost.',
    },

    // ── Day container ───────────────────────────────────────────────
    ItineraryDay: {
      props: z.object({
        dayNumber: z.number(),
        date: z.string(),
        title: z.string(),
        summary: z.string(),
        totalCost: z.number().optional(),
        currency: z.string().optional(),
      }),
      description:
        'Collapsible card representing a single day. Contains TimeBlock children for morning, afternoon, and evening.',
    },

    // ── Time-of-day section ─────────────────────────────────────────
    TimeBlock: {
      props: z.object({
        period: z.enum(['morning', 'afternoon', 'evening']),
      }),
      description:
        'Groups activities and restaurants under a morning / afternoon / evening label. Must be a direct child of ItineraryDay.',
    },

    // ── Activity card ───────────────────────────────────────────────
    ActivityCard: {
      props: z.object({
        name: z.string(),
        description: z.string(),
        duration: z.number().describe('Duration in minutes'),
        costAmount: z.number(),
        currency: z.string(),
        category: z.enum([
          'sightseeing',
          'adventure',
          'cultural',
          'relaxation',
          'entertainment',
          'shopping',
        ]),
        locationName: z.string(),
        locationAddress: z.string().optional(),
        matchedVibes: z.array(z.string()).optional(),
        vibeReasoning: z.string().optional(),
        requiresReservation: z.boolean().optional(),
        bookingUrl: z.string().optional(),
      }),
      description:
        'A single activity within a TimeBlock. Displays name, description, duration, cost, location, and vibe-match tags.',
    },

    // ── Restaurant card ─────────────────────────────────────────────
    RestaurantCard: {
      props: z.object({
        name: z.string(),
        description: z.string(),
        cuisineTypes: z.array(z.string()),
        priceLevel: z.number().min(1).max(4).describe('1=$ to 4=$$$$'),
        costAmount: z.number(),
        currency: z.string(),
        perPerson: z.boolean(),
        mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
        locationName: z.string(),
        locationAddress: z.string().optional(),
        dietaryOptions: z.array(z.string()).optional(),
        matchedVibes: z.array(z.string()).optional(),
        vibeReasoning: z.string().optional(),
        reservationRecommended: z.boolean().optional(),
        reservationUrl: z.string().optional(),
      }),
      description:
        'A restaurant recommendation within a TimeBlock. Shows cuisine, price level, dietary info, and vibe match.',
    },

    // ── Supporting sections ─────────────────────────────────────────
    TipsList: {
      props: z.object({
        title: z.string(),
        tips: z.array(z.string()),
      }),
      description:
        'Bulleted list of tips (daily pro-tips, general travel tips, etc.).',
    },

    PackingList: {
      props: z.object({
        items: z.array(z.string()),
      }),
      description: 'Chip/tag grid of recommended packing items.',
    },

    CostSummary: {
      props: z.object({
        totalAmount: z.number(),
        currency: z.string(),
        breakdown: z
          .array(
            z.object({
              label: z.string(),
              amount: z.number(),
            }),
          )
          .optional(),
      }),
      description:
        'Total trip cost with optional per-category breakdown.',
    },

    Section: {
      props: z.object({
        title: z.string(),
      }),
      description:
        'Generic titled section wrapper. Use for grouping content like "Day-by-Day Itinerary" or "Travel Tips".',
    },
  },

  actions: {
    share_trip: {
      description: 'Share the trip itinerary via native share sheet or clipboard.',
    },
    export_pdf: {
      description: 'Export the itinerary as a PDF document.',
    },
    book_activity: {
      description: 'Open booking URL for an activity or restaurant.',
    },
    toggle_day: {
      description: 'Expand or collapse a day card.',
    },
  },
});

/** Pre-built system prompt fragment describing available components. */
export const catalogPrompt = tripCatalog.prompt();
