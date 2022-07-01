import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import { ErrorsMessagesType } from "../types";


export const bloggerValidation = [
 body('name').trim().isLength({max: 15}).withMessage('Name length should be max 15').isString().notEmpty(),
 body('youtubeUrl').trim().matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).isLength({max: 100}).notEmpty().isString()
]

export const postValidation = [
 body('title').trim().notEmpty().isString().isLength({max: 30}),
 body('shortDescription').notEmpty().isString().isLength({max: 100}),
 body('content').trim().notEmpty().isString().isLength({max: 1000})
]

export const userValidation = [
    body('login').isString().isLength({min: 3, max: 10}).notEmpty(),
    body('password').isString().isLength({min: 6, max: 20}).notEmpty(),
]

export const bloggerIdValidation = body('bloggerId').isString().notEmpty()

export const commentValidation = body('content').isString().isLength({min:20, max:300})


export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
});

export const sendError = (errors:any):ErrorsMessagesType => {
    return {
        errorsMessages: errors.array({onlyFirstError:true}),
        // resultCode: 1
    }
}



export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = myValidationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json(sendError(errors))
        return;
    } else {
        next()
    }
}