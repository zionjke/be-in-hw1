import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization === undefined) {
        res.status(401)
        return
    }

    const encoded = req.headers.authorization.split(' ')[1];

    const decoded = new Buffer(encoded, 'base64').toString();

    const name = decoded.split(':')[0];
    const password = decoded.split(':')[1];

    if (name === 'admin' && password === 'qwerty') {
        next()
    } else {
        res.status(401).send('You are not authenticated!')
    }
}