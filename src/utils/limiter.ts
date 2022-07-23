import {NextFunction, Response, Request} from "express";
import {subSeconds} from "date-fns";
import {limitsCollection} from "../db";
import { IpRequestType } from "../types";



export const checkLimitRequest = async (req: Request, res: Response, next: NextFunction) => {

    const ipRequest: IpRequestType = {
        ip: req.ip,
        endpoint: req.baseUrl + req.path,
        createdAt: new Date()
    }

    await limitsCollection.insertOne(ipRequest)

    const currentDate = new Date();

    const fromDate = subSeconds(currentDate, 10);

    const count = await limitsCollection.countDocuments({
        ip: ipRequest.ip,
        endpoint: ipRequest.endpoint,
        createdAt: {$gte: fromDate, $lte: currentDate}
    })

    console.log(count)

    await limitsCollection.deleteMany({
        ip: ipRequest.ip,
        endpoint: ipRequest.endpoint,
        createdAt: {$lt: fromDate}
    })

    if (count > 5) {
        res.sendStatus(429)
        return;
    }

    next()
}

