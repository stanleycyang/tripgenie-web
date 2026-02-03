/**
 * POST /api/search/start
 * Start a new travel search workflow
 * 
 * Uses streaming to return immediately while processing continues
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SearchInput, StartSearchResponse } from '@/lib/search/types';

// Initialize Supabase client with service role for server operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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

    // Calculate estimated time
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const estimatedTime = Math.min(60, 20 + nights * 5);

    // Trigger the execute endpoint via fetch (fire and forget)
    // This won't complete within this request's lifetime, but the execute
    // endpoint has its own maxDuration setting
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    fetch(`${baseUrl}/api/search/${searchId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination,
        startDate,
        endDate,
        travelers: travelers || 2,
        travelerType,
        vibes: vibes || [],
        budget: budget || 'moderate',
        userId: userId || undefined,
      }),
    }).catch(error => {
      console.error('[Search Start] Execute trigger error:', error);
    });

    const response: StartSearchResponse = {
      searchId,
      workflowRunId,
      status: 'started',
      estimatedTime,
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
// Pro plan redeploy 1770161771
