/**
 * Travel Search Workflow
 * Orchestrates the multi-agent search process using Vercel Workflows
 */

import { workflow, WorkflowContext } from '@vercel/workflow';
import {
  SearchInput,
  SearchPlan,
  HotelResult,
  ActivityResult,
  DiningResult,
  SearchResults,
} from './types';
import {
  runOrchestratorAgent,
  runHotelsAgent,
  runActivitiesAgent,
  runDiningAgent,
  runAggregatorAgent,
} from './agents';

export interface TravelSearchWorkflowInput {
  searchId: string;
  input: SearchInput;
}

export interface TravelSearchWorkflowOutput {
  searchId: string;
  status: 'completed' | 'error';
  results?: SearchResults;
  error?: string;
}

/**
 * Main travel search workflow
 * Runs agents in parallel where possible, with orchestrator first
 */
export const travelSearchWorkflow = workflow<TravelSearchWorkflowInput, TravelSearchWorkflowOutput>(
  {
    name: 'travel-search',
    version: '1.0.0',
  },
  async (ctx: WorkflowContext<TravelSearchWorkflowInput>) => {
    const { searchId, input } = ctx.input;

    try {
      // Step 1: Orchestrator Agent - Creates the search plan
      await ctx.run('update-progress', async () => {
        await updateSearchProgress(searchId, { orchestrator: 'searching' });
      });

      const searchPlan = await ctx.run('orchestrator', async () => {
        const plan = await runOrchestratorAgent(input);
        await updateSearchProgress(searchId, { orchestrator: 'done' });
        return plan;
      });

      // Step 2: Run specialized agents in parallel
      await ctx.run('update-progress-searching', async () => {
        await updateSearchProgress(searchId, {
          hotels: 'searching',
          activities: 'searching',
          dining: 'searching',
        });
      });

      // Hotels, Activities, and Dining agents run concurrently
      const [hotels, activities, dining] = await Promise.all([
        ctx.run('hotels-agent', async () => {
          const results = await runHotelsAgent(searchPlan, 10);
          await updateSearchProgress(searchId, { hotels: 'done' });
          return results;
        }),
        ctx.run('activities-agent', async () => {
          const results = await runActivitiesAgent(searchPlan, 15);
          await updateSearchProgress(searchId, { activities: 'done' });
          return results;
        }),
        ctx.run('dining-agent', async () => {
          const results = await runDiningAgent(searchPlan, 12);
          await updateSearchProgress(searchId, { dining: 'done' });
          return results;
        }),
      ]);

      // Step 3: Aggregator Agent - Combines results into itinerary
      await ctx.run('update-progress-aggregating', async () => {
        await updateSearchProgress(searchId, { aggregator: 'searching' });
      });

      const { days, topHotel } = await ctx.run('aggregator', async () => {
        const result = await runAggregatorAgent(searchPlan, hotels, activities, dining);
        await updateSearchProgress(searchId, { aggregator: 'done' });
        return result;
      });

      // Step 4: Save results to database
      const results: SearchResults = {
        searchId,
        hotels,
        activities,
        dining,
        itinerary: days,
      };

      await ctx.run('save-results', async () => {
        await saveSearchResults(searchId, results);
        await updateSearchStatus(searchId, 'completed');
      });

      return {
        searchId,
        status: 'completed',
        results,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      await ctx.run('handle-error', async () => {
        await updateSearchStatus(searchId, 'error', errorMessage);
      });

      return {
        searchId,
        status: 'error',
        error: errorMessage,
      };
    }
  }
);

/**
 * Update search progress in Supabase
 */
async function updateSearchProgress(
  searchId: string,
  progress: Record<string, string>
): Promise<void> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  await fetch(`${baseUrl}/api/search/${searchId}/progress`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });
}

/**
 * Update search status in Supabase
 */
async function updateSearchStatus(
  searchId: string,
  status: string,
  errorMessage?: string
): Promise<void> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  await fetch(`${baseUrl}/api/search/${searchId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, errorMessage }),
  });
}

/**
 * Save search results to Supabase
 */
async function saveSearchResults(
  searchId: string,
  results: SearchResults
): Promise<void> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  await fetch(`${baseUrl}/api/search/${searchId}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results),
  });
}
