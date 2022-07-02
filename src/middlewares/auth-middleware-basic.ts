import {NextFunction, Request, Response} from "express";

export const authMiddlewareBasic = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization === undefined) {
        res.status(401).send('Please provide WWW-Authorization using BASIC in headers with base 64 encoding');
        return
    }

    const tokenVersion = req.headers.authorization.split(' ')[0]

    if (tokenVersion !== 'Basic') {
        res.status(401).send('Please provide WWW-Authorization using BASIC in headers with base 64 encoding');
        return;
    }

    const encoded = req.headers.authorization.split(' ')[1];


    const decoded = new Buffer(encoded, 'base64').toString();

    const name = decoded.split(':')[0];
    const password = decoded.split(':')[1];

    if (name !== 'admin' || password !== 'qwerty') {
        res.status(401).send('Invalid authorization data provided. Please check username and pwd')
        return;
    }
    next()
}