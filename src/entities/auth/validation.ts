import {body} from "express-validator";

export const registrationCodeValidation = body('code').isString().notEmpty()