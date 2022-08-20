import {NextFunction, Response, Request} from "express";
import {subSeconds} from "date-fns";
import {IpRequestType} from "../types";


// export const checkLimitRequestWithDB = async (req: Request, res: Response, next: NextFunction) => {
//
//     const currentDate = new Date();
//
//     const ipRequest: IpRequestType = {
//         ip: req.headers['x-forwarded-for'] as string,
//         endpoint: req.baseUrl + req.path + req.method,
//         createdAt: currentDate
//     }
//
//
//     await limitsCollection.insertOne(ipRequest)
//
//     const fromDate = subSeconds(currentDate, 10);
//
//     const count = await limitsCollection.countDocuments({
//         ip: ipRequest.ip,
//         endpoint: ipRequest.endpoint,
//         createdAt: {$gt: fromDate}
//     })
//
//     await limitsCollection.deleteMany({
//         createdAt: {$lt: fromDate}
//     })
//
//     if (count > 5) {
//         res.sendStatus(429)
//         return;
//     }
//
//     next()
// }

let requests: IpRequestType[] = []

export const checkRequestsLimit = (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();

    const ipRequest: IpRequestType = {
        ip: req.headers['x-forwarded-for'] as string,
        endpoint: req.baseUrl + req.path + req.method,
        createdAt: currentDate
    }

    const fromDate = subSeconds(currentDate, 10);

    requests.push(ipRequest)

    const limits = requests.filter(el => el.ip === ipRequest.ip && el.endpoint === ipRequest.endpoint && el.createdAt > fromDate)

    requests = requests.filter(el => el.createdAt < fromDate)

    if (limits.length > 5) {
        res.sendStatus(429)
        return;
    }

    next()
}
