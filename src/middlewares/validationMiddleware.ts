import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";

type ErrorsMessagesType = {
    errorsMessages: [
        {
            message: string,
            field: string,
        }

    ],
    resultCode?: number
}


export const nameValidation = body('name').trim().isLength({max: 15}).withMessage('Name length should be max 15').isString().notEmpty();
export const urlValidation = body('youtubeUrl').trim().matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).isLength({max: 100}).notEmpty().isString();
export const titleValidation = body('title').trim().notEmpty().isString().isLength({max: 30})
export const shortDescriptionValidation = body('shortDescription').notEmpty().isString().isLength({max: 100})
export const contentValidation = body('content').trim().notEmpty().isString().isLength({max: 1000})
export const bloggerIdValidation = body('bloggerId').isNumeric().notEmpty()



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
        return
    } else {
        next()
    }
}