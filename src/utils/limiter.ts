import {NextFunction, Response, Request} from "express";
import {subSeconds} from "date-fns";
import {limitsCollection} from "../db";

type ipRequest = {
    ip: string,
    endpoint: string
    createdAt: Date
}

const requests: ipRequest[] = []

export const checkLimitRequest = async (req: Request, res: Response, next: NextFunction) => {

    const ipRequest: ipRequest = {
        ip: req.ip,
        endpoint: req.baseUrl + req.path,
        createdAt: new Date()
    }

    // requests.push(ipRequest)

    await limitsCollection.insertOne({...ipRequest})

    const currentDate = new Date();

    const fromDate = subSeconds(currentDate, 10);

    const count = await limitsCollection.countDocuments({
        ip: ipRequest.ip,
        endpoint: ipRequest.endpoint,
        createdAt: {$gte: fromDate, $lte: currentDate}
    })

    await limitsCollection.deleteMany({
        ip: ipRequest.ip,
        endpoint: ipRequest.endpoint,
        createdAt: {$lt: fromDate}
    })

    // const limitsCount = requests.filter(el => el.ip === ipRequest.ip && el.endpoint === ipRequest.endpoint && el.createdAt >= fromDate && el.createdAt <= currentDate)

    if (count > 5) {
        res.sendStatus(429)
        return;
    }

    next()
}

