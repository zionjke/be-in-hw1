import {body} from "express-validator";

export const userValidation = [
    body('login', 'The login must be min 3 and max 10 length').isString().isLength({min: 3, max: 10}).notEmpty(),
    body('password', 'The password must be min 6 and max 20 length').isString().isLength({min: 6, max: 20}).notEmpty(),
    body('email', 'Enter valid email').isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).notEmpty(),
]
