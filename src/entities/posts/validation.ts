import {body} from "express-validator";

export const postValidation = [
    body('title', 'Post title length should be max 15').trim().notEmpty().isString().isLength({max: 30}),
    body('shortDescription', 'Post description length should be max 100').notEmpty().isString().isLength({max: 100}),
    body('content', 'Post content length should be max 1000').trim().notEmpty().isString().isLength({max: 1000}),

]

export const bloggerIdValidation = body('bloggerId').isString().notEmpty()
