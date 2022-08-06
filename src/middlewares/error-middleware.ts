import {ApiError} from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('ERROR', error)

    if (error instanceof ApiError) {
        return res.status(error.status).json({
            errorsMessages: [
                {
                    message: error.message,
                    field: error.field,
                }
            ]
        })
    }

    return res.status(500).json({message: 'Unexpected error'})
}
