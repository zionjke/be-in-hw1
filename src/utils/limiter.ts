import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an 10 second',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})