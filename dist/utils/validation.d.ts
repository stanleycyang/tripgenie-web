/**
 * Zod validation schemas for API requests
 * Centralizes all input validation logic
 */
import { z } from 'zod';
export declare const uuidSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const dateSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    name: string;
}, {
    password: string;
    email: string;
    name: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const tripStatusSchema: z.ZodEnum<["draft", "planning", "booked", "in_progress", "completed", "cancelled"]>;
export declare const createTripSchema: z.ZodEffects<z.ZodObject<{
    destination: z.ZodString;
    start_date: z.ZodEffects<z.ZodString, string, string>;
    end_date: z.ZodEffects<z.ZodString, string, string>;
    budget: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["draft", "planning", "booked", "in_progress", "completed", "cancelled"]>>>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled";
    destination: string;
    start_date: string;
    end_date: string;
    budget?: number | undefined;
}, {
    destination: string;
    start_date: string;
    end_date: string;
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
}>, {
    status: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled";
    destination: string;
    start_date: string;
    end_date: string;
    budget?: number | undefined;
}, {
    destination: string;
    start_date: string;
    end_date: string;
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
}>;
export declare const updateTripSchema: z.ZodEffects<z.ZodObject<{
    destination: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    end_date: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    budget: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["draft", "planning", "booked", "in_progress", "completed", "cancelled"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
    destination?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}, {
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
    destination?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}>, {
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
    destination?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}, {
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    budget?: number | undefined;
    destination?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}>;
export declare const activitySchema: z.ZodObject<{
    time: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    duration_minutes: z.ZodOptional<z.ZodNumber>;
    cost: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    time: string;
    title: string;
    description: string;
    location?: string | undefined;
    duration_minutes?: number | undefined;
    cost?: number | undefined;
    category?: string | undefined;
}, {
    time: string;
    title: string;
    description?: string | undefined;
    location?: string | undefined;
    duration_minutes?: number | undefined;
    cost?: number | undefined;
    category?: string | undefined;
}>;
export declare const createItinerarySchema: z.ZodObject<{
    trip_id: z.ZodString;
    day_number: z.ZodNumber;
    activities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        title: z.ZodString;
        description: z.ZodDefault<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        duration_minutes: z.ZodOptional<z.ZodNumber>;
        cost: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        time: string;
        title: string;
        description: string;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }, {
        time: string;
        title: string;
        description?: string | undefined;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    trip_id: string;
    day_number: number;
    activities: {
        time: string;
        title: string;
        description: string;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }[];
    notes?: string | undefined;
}, {
    trip_id: string;
    day_number: number;
    activities?: {
        time: string;
        title: string;
        description?: string | undefined;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }[] | undefined;
    notes?: string | undefined;
}>;
export declare const updateItinerarySchema: z.ZodObject<{
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        title: z.ZodString;
        description: z.ZodDefault<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        duration_minutes: z.ZodOptional<z.ZodNumber>;
        cost: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        time: string;
        title: string;
        description: string;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }, {
        time: string;
        title: string;
        description?: string | undefined;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    activities?: {
        time: string;
        title: string;
        description: string;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }[] | undefined;
    notes?: string | null | undefined;
}, {
    activities?: {
        time: string;
        title: string;
        description?: string | undefined;
        location?: string | undefined;
        duration_minutes?: number | undefined;
        cost?: number | undefined;
        category?: string | undefined;
    }[] | undefined;
    notes?: string | null | undefined;
}>;
export declare const travelStyleSchema: z.ZodEnum<["budget", "mid_range", "luxury", "backpacker", "business"]>;
export declare const updatePreferencesSchema: z.ZodObject<{
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    travel_style: z.ZodOptional<z.ZodNullable<z.ZodEnum<["budget", "mid_range", "luxury", "backpacker", "business"]>>>;
    dietary_restrictions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    interests?: string[] | undefined;
    travel_style?: "budget" | "mid_range" | "luxury" | "backpacker" | "business" | null | undefined;
    dietary_restrictions?: string[] | undefined;
}, {
    interests?: string[] | undefined;
    travel_style?: "budget" | "mid_range" | "luxury" | "backpacker" | "business" | null | undefined;
    dietary_restrictions?: string[] | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const tripQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["draft", "planning", "booked", "in_progress", "completed", "cancelled"]>>;
    destination: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    destination?: string | undefined;
}, {
    status?: "draft" | "planning" | "booked" | "in_progress" | "completed" | "cancelled" | undefined;
    destination?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CreateItineraryInput = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryInput = z.infer<typeof updateItinerarySchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type TripQuery = z.infer<typeof tripQuerySchema>;
//# sourceMappingURL=validation.d.ts.map