/**
 * API Routes Index
 * Combines all route modules
 */

import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'TripGenie API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);

export default router;
