import {NextFunction, Request, Response} from "express";

export const checkContentType = (contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["content-type"] === contentType) {
        next()
    } else {
        res.status(401).send('Bad content type')
    }
}