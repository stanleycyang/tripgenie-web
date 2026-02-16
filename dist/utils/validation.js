"use strict";
/**
 * Zod validation schemas for API requests
 * Centralizes all input validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripQuerySchema = exports.paginationSchema = exports.updatePreferencesSchema = exports.travelStyleSchema = exports.updateItinerarySchema = exports.createItinerarySchema = exports.activitySchema = exports.updateTripSchema = exports.createTripSchema = exports.tripStatusSchema = exports.loginSchema = exports.registerSchema = exports.dateSchema = exports.passwordSchema = exports.emailSchema = exports.uuidSchema = void 0;
const zod_1 = require("zod");
// ============================================
// Common Schemas
// ============================================
exports.uuidSchema = zod_1.z.string().uuid('Invalid UUID format');
exports.emailSchema = zod_1.z.string().email('Invalid email format').toLowerCase().trim();
exports.passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
exports.dateSchema = zod_1.z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
}, { message: 'Invalid date format' });
// ============================================
// Auth Schemas
// ============================================
exports.registerSchema = zod_1.z.object({
    email: exports.emailSchema,
    name: zod_1.z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters')
        .trim(),
    password: exports.passwordSchema,
});
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, 'Password is required'),
});
// ============================================
// Trip Schemas
// ============================================
exports.tripStatusSchema = zod_1.z.enum([
    'draft',
    'planning',
    'booked',
    'in_progress',
    'completed',
    'cancelled',
]);
exports.createTripSchema = zod_1.z
    .object({
    destination: zod_1.z
        .string()
        .min(1, 'Destination is required')
        .max(500, 'Destination must be less than 500 characters')
        .trim(),
    start_date: exports.dateSchema,
    end_date: exports.dateSchema,
    budget: zod_1.z.number().positive('Budget must be positive').optional(),
    status: exports.tripStatusSchema.optional().default('draft'),
})
    .refine((data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end >= start;
}, {
    message: 'End date must be on or after start date',
    path: ['end_date'],
});
exports.updateTripSchema = zod_1.z
    .object({
    destination: zod_1.z.string().min(1).max(500).trim().optional(),
    start_date: exports.dateSchema.optional(),
    end_date: exports.dateSchema.optional(),
    budget: zod_1.z.number().positive().optional(),
    status: exports.tripStatusSchema.optional(),
})
    .refine((data) => {
    if (data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return end >= start;
    }
    return true;
}, {
    message: 'End date must be on or after start date',
    path: ['end_date'],
});
// ============================================
// Itinerary Schemas
// ============================================
exports.activitySchema = zod_1.z.object({
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    title: zod_1.z.string().min(1, 'Activity title is required').max(255),
    description: zod_1.z.string().max(2000).default(''),
    location: zod_1.z.string().max(500).optional(),
    duration_minutes: zod_1.z.number().positive().optional(),
    cost: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().max(100).optional(),
});
exports.createItinerarySchema = zod_1.z.object({
    trip_id: exports.uuidSchema,
    day_number: zod_1.z.number().int().positive('Day number must be positive'),
    activities: zod_1.z.array(exports.activitySchema).default([]),
    notes: zod_1.z.string().max(5000).optional(),
});
exports.updateItinerarySchema = zod_1.z.object({
    activities: zod_1.z.array(exports.activitySchema).optional(),
    notes: zod_1.z.string().max(5000).nullable().optional(),
});
// ============================================
// Preferences Schemas
// ============================================
exports.travelStyleSchema = zod_1.z.enum([
    'budget',
    'mid_range',
    'luxury',
    'backpacker',
    'business',
]);
exports.updatePreferencesSchema = zod_1.z.object({
    interests: zod_1.z.array(zod_1.z.string().max(100)).max(50).optional(),
    travel_style: exports.travelStyleSchema.nullable().optional(),
    dietary_restrictions: zod_1.z.array(zod_1.z.string().max(100)).max(20).optional(),
});
// ============================================
// Query Schemas
// ============================================
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
exports.tripQuerySchema = exports.paginationSchema.extend({
    status: exports.tripStatusSchema.optional(),
    destination: zod_1.z.string().optional(),
});
//# sourceMappingURL=validation.js.map