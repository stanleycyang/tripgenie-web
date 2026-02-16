"use strict";
/**
 * Request Validation Middleware
 * Validates request body, params, and query using Zod schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.validateQuery = exports.validateParams = exports.validateBody = exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Create validation middleware for a specific request location
 * @param schema - Zod schema to validate against
 * @param location - Where to find the data (body, params, query)
 */
const validate = (schema, location = 'body') => {
    return (req, _res, next) => {
        try {
            // Parse and validate the data
            const data = schema.parse(req[location]);
            // Replace request data with validated/transformed data
            // This ensures any transformations (like .trim(), .toLowerCase()) are applied
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req[location] = data;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(error);
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
/**
 * Validate request body
 */
const validateBody = (schema) => (0, exports.validate)(schema, 'body');
exports.validateBody = validateBody;
/**
 * Validate request params
 */
const validateParams = (schema) => (0, exports.validate)(schema, 'params');
exports.validateParams = validateParams;
/**
 * Validate request query
 */
const validateQuery = (schema) => (0, exports.validate)(schema, 'query');
exports.validateQuery = validateQuery;
/**
 * Validate multiple locations at once
 */
const validateRequest = (schemas) => {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                req.params = schemas.params.parse(req.params);
            }
            if (schemas.query) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                req.query = schemas.query.parse(req.query);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.js.map