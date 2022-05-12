import {body, validationResult} from "express-validator";

type ErrorsMessagesType = {
    errorsMessages: [
        {
            message: string,
            field: string,
        }

    ],
    resultCode: number
}

type ErrorType = {
    message: string,
    field: string,
}




export const validateUrl = (url:string) => {
    return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(url);
}



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
        errorsMessages: errors.array(),
        resultCode: 1
    }
}


export const nameValidation = body('name').isLength({max: 15}).withMessage('Name length should be max 15').isString().notEmpty();
export const urlValidation = body('youtubeUrl').matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).isLength({max: 100}).notEmpty().isString();


export const titleValidation = body('title').notEmpty().isString().isLength({max: 30})
export const shortDescriptionValidation = body('shortDescription').notEmpty().isString().isLength({max: 100})
export const contentValidation = body('content').notEmpty().isString().isLength({max: 1000})
export const bloggerIdValidation = body('bloggerId').isNumeric().notEmpty()