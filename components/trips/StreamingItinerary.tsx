'use client';

/**
 * StreamingItinerary
 *
 * Fetches an AI-generated json-render spec via SSE, compiles incoming
 * chunks with createSpecStreamCompiler, and renders the growing component
 * tree in real-time using the TripGenie registry.
 *
 * This gives users immediate visual feedback — cards, tips, and days
 * appear on screen as the model streams them rather than waiting for the
 * full response.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createSpecStreamCompiler } from '@json-render/core';
import { Renderer } from '@json-render/react';
import { Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { registry } from '@/lib/json-render/registry';
import type { TripPreferences } from '@/lib/ai/types';

type StreamStatus = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

interface StreamingItineraryProps {
  /** Trip preferences to send to the generation API. */
  preferences: TripPreferences;
  /** If provided, will be used instead of making a new API call. */
  existingSpec?: Record<string, unknown>;
  /** Called when streaming completes with the final spec. */
  onComplete?: (spec: Record<string, unknown>) => void;
  /** Called on error with the error message. */
  onError?: (error: string) => void;
}

export function StreamingItinerary({
  preferences,
  existingSpec,
  onComplete,
  onError,
}: StreamingItineraryProps) {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(existingSpec ?? null);
  const [status, setStatus] = useState<StreamStatus>(existingSpec ? 'complete' : 'idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async () => {
    // Cleanup any existing stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('connecting');
    setErrorMessage(null);
    setSpec(null);

    try {
      const res = await fetch('/api/itinerary/stream-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error('Response body is empty');
      }

      setStatus('streaming');

      const compiler = createSpecStreamCompiler();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const { result } = compiler.push(chunk);
          if (result) {
            setSpec({ ...result } as Record<string, unknown>);
          }
        }
      }

      // Final result
      const finalSpec = compiler.getResult();
      if (finalSpec) {
        setSpec({ ...finalSpec } as Record<string, unknown>);
        onComplete?.(finalSpec as Record<string, unknown>);
      }
      setStatus('complete');
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // Intentional abort
      }
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setErrorMessage(msg);
      setStatus('error');
      onError?.(msg);
    }
  }, [preferences, onComplete, onError]);

  // Auto-start on mount if no existing spec
  useEffect(() => {
    if (!existingSpec) {
      startStreaming();
    }
    return () => {
      abortRef.current?.abort();
    };
    // Only run once on mount (or when preferences identity changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Connecting state ───────────────────────────────────────────────
  if (status === 'connecting') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Preparing Your Itinerary</h3>
            <p className="text-sm text-gray-600">
              Connecting to AI planner...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">Generation Failed</h3>
            <p className="text-sm text-red-700 mb-4">
              {errorMessage || 'Something went wrong while generating your itinerary.'}
            </p>
            <button
              onClick={startStreaming}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Streaming / Complete — render whatever we have so far ──────────
  return (
    <div>
      {/* Streaming indicator */}
      {status === 'streaming' && (
        <div className="flex items-center gap-3 mb-4 px-1">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-sm text-gray-500">
            Building your itinerary — cards will appear as they&apos;re ready...
          </span>
        </div>
      )}

      {/* The incrementally-rendered component tree */}
      {spec ? (
        <Renderer spec={spec} registry={registry} />
      ) : status === 'idle' ? null : (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Completion indicator */}
      {status === 'complete' && spec && (
        <div className="mt-6 text-center text-sm text-gray-400">
          Itinerary generated successfully
        </div>
      )}
    </div>
  );
}
