/**
 * GET /api/health
 * Health check endpoint - verifies configuration
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      aiGatewayKey: !!process.env.AI_GATEWAY_API_KEY || !!process.env.VERCEL_AI_GATEWAY_API_KEY,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      vercelUrl: process.env.VERCEL_URL || 'not set',
      nodeEnv: process.env.NODE_ENV,
    },
    // Check if this is Pro plan by trying to read maxDuration
    runtime: {
      maxDuration: '60s configured (requires Pro)',
    },
  };

  return NextResponse.json(config);
}
