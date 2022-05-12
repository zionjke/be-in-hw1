import {NextFunction, Request, Response} from "express";
import {myValidationResult, sendError} from "../validation";

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = myValidationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json(sendError(errors))
        return
    } else {
        next()
    }
}