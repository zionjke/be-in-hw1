import rateLimit from "express-rate-limit";
import {NextFunction, Response, Request} from "express";
import addMilliseconds from "date-fns/addMilliseconds";

export const authLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an 10 second',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    skipFailedRequests: false,
    skipSuccessfulRequests: true
})

type LimitType = {
    ip: string,
    time: Date
}

const requests: LimitType[] = []

export const checkLimitRequest = async (req: Request, res: Response, next: NextFunction) => {

    const {ip} = req

    const maxLimitInterval = 10 * 1000;

    const maxRequest = 5;

    const currentDate = new Date();

    const dateFrom = addMilliseconds(currentDate, -maxLimitInterval);

    const a = requests.filter(el => el.time > dateFrom)

    if (a.length > maxRequest) {
        res.sendStatus(429)
        return;
    }

    requests.push({ip, time: currentDate})

    console.log(a)

    next()
}

