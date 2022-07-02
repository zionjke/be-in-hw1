import {Router} from "express";
import {bloggerValidation, postValidation,} from "../middlewares/validationMiddleware";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../middlewares/auth-middleware-basic";
import {bloggersController} from "../controllers/bloggers-controller";


export const bloggersRouter = Router()

bloggersRouter
    .get('/', bloggersController.getBloggers)

    .post('/', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.createNewBlogger)

    .get('/:id', bloggersController.getBloggerById)

    .put('/:id', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.updateBlogger)

    .delete('/:id', authMiddlewareBasic, bloggersController.deleteBlogger)

    .get('/:bloggerId/posts', bloggersController.getBloggerPosts)

    .post('/:bloggerId/posts', authMiddlewareBasic, postValidation, validationMiddleware, bloggersController.createNewBloggerPost)