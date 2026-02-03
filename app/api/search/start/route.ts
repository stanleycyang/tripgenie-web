/**
 * POST /api/search/start
 * Start a new travel search workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SearchInput, StartSearchResponse } from '@/lib/search/types';
import { executeTravelSearch } from '@/lib/search';

// Initialize Supabase client with service role for server operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { destination, startDate, endDate, travelers, travelerType, vibes, budget } = body as SearchInput;
    
    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 }
      );
    }

    // Get user ID from auth header if present
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Create search record in database
    const { data: search, error: insertError } = await supabase
      .from('searches')
      .insert({
        user_id: userId,
        destination,
        start_date: startDate,
        end_date: endDate,
        travelers: travelers || 2,
        traveler_type: travelerType || null,
        vibes: vibes || [],
        budget: budget || 'moderate',
        status: 'pending',
        progress: {
          orchestrator: 'pending',
          hotels: 'pending',
          activities: 'pending',
          dining: 'pending',
          aggregator: 'pending',
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Search Start] Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create search record' },
        { status: 500 }
      );
    }

    const searchId = search.id;
    const workflowRunId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update search with workflow ID and start status
    await supabase
      .from('searches')
      .update({ 
        workflow_run_id: workflowRunId,
        status: 'searching',
      })
      .eq('id', searchId);

    // Execute the search synchronously
    // This will take 20-60 seconds but ensures completion
    const searchInput: SearchInput = {
      destination,
      startDate,
      endDate,
      travelers: travelers || 2,
      travelerType,
      vibes: vibes || [],
      budget: budget || 'moderate',
      userId: userId || undefined,
    };

    // Run the search with progress callbacks
    const result = await executeTravelSearch(searchId, searchInput, {
      onProgress: async (stage, status) => {
        // Update progress in database
        const { data: current } = await supabase
          .from('searches')
          .select('progress')
          .eq('id', searchId)
          .single();
        
        const newProgress = { ...current?.progress, [stage]: status };
        await supabase
          .from('searches')
          .update({ progress: newProgress })
          .eq('id', searchId);
      },
    });

    if (result.status === 'completed' && result.results) {
      // Save results to database
      for (const hotel of result.results.hotels) {
        await supabase.from('search_results').insert({
          search_id: searchId,
          category: 'hotel',
          name: hotel.name,
          description: hotel.description,
          data: hotel,
          affiliate_url: hotel.affiliateUrl,
          affiliate_partner: hotel.affiliatePartner,
          price_amount: hotel.pricePerNight,
          price_currency: hotel.currency,
          vibe_score: hotel.vibeScore,
          rating: hotel.userRating,
          location_name: hotel.location?.name,
          location_address: hotel.location?.address,
          location_lat: hotel.location?.lat,
          location_lng: hotel.location?.lng,
          image_url: hotel.images?.[0],
          images: hotel.images,
        });
      }

      for (const activity of result.results.activities) {
        await supabase.from('search_results').insert({
          search_id: searchId,
          category: 'activity',
          name: activity.name,
          description: activity.description,
          data: activity,
          affiliate_url: activity.affiliateUrl,
          affiliate_partner: activity.affiliatePartner,
          price_amount: activity.price,
          price_currency: activity.currency,
          vibe_score: activity.vibeScore,
          rating: activity.rating,
          location_name: activity.location?.name,
          location_address: activity.location?.address,
          location_lat: activity.location?.lat,
          location_lng: activity.location?.lng,
          image_url: activity.images?.[0],
          images: activity.images,
        });
      }

      for (const restaurant of result.results.dining) {
        await supabase.from('search_results').insert({
          search_id: searchId,
          category: 'dining',
          name: restaurant.name,
          description: restaurant.description,
          data: restaurant,
          affiliate_url: restaurant.reservationUrl,
          affiliate_partner: restaurant.affiliatePartner,
          price_amount: null,
          price_currency: 'USD',
          vibe_score: restaurant.vibeScore,
          rating: restaurant.rating,
          location_name: restaurant.location?.name,
          location_address: restaurant.location?.address,
          location_lat: restaurant.location?.lat,
          location_lng: restaurant.location?.lng,
          image_url: restaurant.images?.[0],
          images: restaurant.images,
        });
      }

      // Save itinerary days
      for (const day of result.results.itinerary) {
        await supabase.from('search_itineraries').insert({
          search_id: searchId,
          day_number: day.dayNumber,
          date: day.date,
          title: day.title,
          summary: day.summary,
          estimated_cost: day.estimatedCost,
          cost_currency: day.currency,
          tips: day.tips,
        });
      }

      // Mark as completed
      await supabase
        .from('searches')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', searchId);
    } else {
      // Mark as error
      await supabase
        .from('searches')
        .update({
          status: 'error',
          error_message: result.error || 'Unknown error',
        })
        .eq('id', searchId);
    }

    const response: StartSearchResponse = {
      searchId,
      workflowRunId,
      status: 'started',
      estimatedTime: 0, // Already complete
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Search Start] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
