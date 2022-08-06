import {body} from "express-validator";

export const commentValidation = body('content', 'Comment content length should be min 20 and max 300').isString().isLength({
    min: 20,
    max: 300
})