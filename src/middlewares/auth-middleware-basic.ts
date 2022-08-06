import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api-error";

export const authMiddlewareBasic = (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.headers.authorization) {
            return next(ApiError.UnauthorizedError())
        }

        const tokenVersion = req.headers.authorization.split(' ')[0]

        if (tokenVersion !== 'Basic') {
            return next(ApiError.UnauthorizedError())
        }

        const encoded = req.headers.authorization.split(' ')[1];

        const decoded = new Buffer(encoded, 'base64').toString();

        const name = decoded.split(':')[0];
        const password = decoded.split(':')[1];

        if (name !== 'admin' || password !== 'qwerty') {
            return next(ApiError.UnauthorizedError())
        }

        next()
    } catch {
        return next(ApiError.UnauthorizedError())
    }

}