import { rateLimit } from "express-rate-limit";


export const limitRequests = (rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 2000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    legacyHeaders: true,
    standardHeaders: 'draft-7',
    message: 'You  have exceeded the umber of requests. Try again in 15 minutes',
    statusCode: 403
    }))