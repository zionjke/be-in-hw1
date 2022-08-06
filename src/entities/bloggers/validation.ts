import {body} from "express-validator";

export const bloggerValidation = [
    body('name', 'Blogger name length should be min 3 and max 15').trim().isLength({
        max: 15,
        min: 3
    }).isString().notEmpty(),
    body('youtubeUrl', 'Blogger youtube link length should  max 100').trim().matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).isLength({max: 100}).notEmpty().isString()
]
