import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 10000 ,
    max: 5
})