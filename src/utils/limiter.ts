import {NextFunction, Response, Request} from "express";
import {subSeconds} from "date-fns";
import {limitsCollection} from "../db";
import { IpRequestType } from "../types";



export const checkLimitRequest = async (req: Request, res: Response, next: NextFunction) => {

    const currentDate = new Date();

    const ipRequest: IpRequestType = {
        ip: req.ip,
        endpoint: req.baseUrl + req.path + req.method,
        createdAt: currentDate
    }

    await limitsCollection.insertOne(ipRequest)

    const fromDate = subSeconds(currentDate, 10);

    const count = await limitsCollection.countDocuments({
        ip: ipRequest.ip,
        endpoint: ipRequest.endpoint,
        createdAt: {$gt: fromDate}
    })

    await limitsCollection.deleteMany({
        createdAt: {$lt: fromDate}
    })

    if (count > 5) {
        res.sendStatus(429)
        return;
    }

    next()
}

