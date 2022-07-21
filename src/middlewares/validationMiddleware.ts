import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {ErrorsMessagesType} from "../types";


export const bloggerValidation = [
    body('name', 'Blogger name length should be min 3 and max 15').trim().isLength({
        max: 15,
        min: 3
    }).isString().notEmpty(),
    body('youtubeUrl', 'Blogger youtube link length should  max 100').trim().matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).isLength({max: 100}).notEmpty().isString()
]

export const postValidation = [
    body('title', 'Post title length should be max 15').trim().notEmpty().isString().isLength({max: 30}),
    body('shortDescription', 'Post description length should be max 100').notEmpty().isString().isLength({max: 100}),
    body('content', 'Post content length should be max 1000').trim().notEmpty().isString().isLength({max: 1000})
]

export const userValidation = [
    body('login').isString().isLength({min: 3, max: 10}).notEmpty(),
    body('password').isString().isLength({min: 6, max: 20}).notEmpty(),
    body('email', 'Enter valid email').isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).notEmpty()
]

export const bloggerIdValidation = body('bloggerId').isString().notEmpty()

export const commentValidation = body('content', 'Comment content length should be min 20 and max 300').isString().isLength({
    min: 20,
    max: 300
})

export const registrationCodeValidation = body('code').isString().notEmpty()


export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
});

// export const sendError = (errors:any):ErrorsMessagesType => {
//     return {
//         errorsMessages: errors.array({onlyFirstError:true}),
//         // resultCode: 1
//     }
// }


export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = myValidationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array({onlyFirstError: true})})
        return;
    } else {
        next()
    }
}

export const sendError = (message: string, field: string): ErrorsMessagesType => {
    return {
        errorsMessages: [
            {
                message,
                field,
            }

        ]
    }
}