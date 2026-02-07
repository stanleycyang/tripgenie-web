/**
 * Trip Routes
 * /api/trips/*
 */

import { Router } from 'express';
import { TripController } from '../controllers';
import {
  authenticate,
  validateBody,
  validateQuery,
  asyncHandler,
} from '../middleware';
import {
  createTripSchema,
  updateTripSchema,
  tripQuerySchema,
} from '../utils/validation';

const router = Router();

// All trip routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/trips
 * @desc    List all trips for the user
 * @access  Private
 * @query   page, limit, status, destination
 */
router.get(
  '/',
  validateQuery(tripQuerySchema),
  asyncHandler(TripController.listTrips)
);

/**
 * @route   GET /api/trips/upcoming
 * @desc    Get upcoming trips
 * @access  Private
 * @query   limit (default: 5)
 */
router.get(
  '/upcoming',
  asyncHandler(TripController.getUpcomingTrips)
);

/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics
 * @access  Private
 */
router.get(
  '/stats',
  asyncHandler(TripController.getTripStats)
);

/**
 * @route   POST /api/trips
 * @desc    Create a new trip
 * @access  Private
 */
router.post(
  '/',
  validateBody(createTripSchema),
  asyncHandler(TripController.createTrip)
);

/**
 * @route   GET /api/trips/:id
 * @desc    Get a specific trip
 * @access  Private
 */
router.get(
  '/:id',
  asyncHandler(TripController.getTrip)
);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update a trip
 * @access  Private
 */
router.put(
  '/:id',
  validateBody(updateTripSchema),
  asyncHandler(TripController.updateTrip)
);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a trip
 * @access  Private
 */
router.delete(
  '/:id',
  asyncHandler(TripController.deleteTrip)
);

export default router;
