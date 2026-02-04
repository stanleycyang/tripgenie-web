/**
 * POST /api/search/start
 * Start a new travel search using Vercel Workflow + AI SDK Agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/server';
import { start } from 'workflow/api';
import { planTripWorkflow } from '@/workflows/plan-trip';

interface SearchInput {
  destination: string;
  startDate: string;
  endDate: string;
  travelers?: number;
  travelerType?: string;
  vibes?: string[];
  budget?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, travelers, travelerType, vibes, budget } = body as SearchInput;

    // Validate required fields
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
      const { data: { user } } = await getSupabase().auth.getUser(token);
      userId = user?.id || null;
    }

    // Create search record
    const { data: search, error: insertError } = await getSupabase()
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

    // Calculate estimated time
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const estimatedTime = Math.min(60, 20 + nights * 5);

    // Start the durable workflow (doesn't block)
    await start(planTripWorkflow, [{
      searchId,
      destination,
      startDate,
      endDate,
      travelers: travelers || 2,
      vibes: vibes || [],
      budget: budget || 'moderate',
      userId: userId || undefined,
    }]);

    // Update status to searching
    await getSupabase()
      .from('searches')
      .update({ status: 'searching' })
      .eq('id', searchId);

    return NextResponse.json({
      searchId,
      status: 'started',
      estimatedTime,
    });
  } catch (error) {
    console.error('[Search Start] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
