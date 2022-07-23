import {NextFunction, Response, Request} from "express";
import {subSeconds} from "date-fns";

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

    requests.push(ipRequest)

    console.log(requests)

    const currentDate = new Date();

    const fromDate = subSeconds(currentDate, 10);

    const limitsCount = requests.filter(el => el.ip === ipRequest.ip && el.endpoint === ipRequest.endpoint && el.createdAt > fromDate)

    if (limitsCount.length > 5) {
        res.sendStatus(429)
        return;
    }

    console.log(limitsCount)

    next()
}

