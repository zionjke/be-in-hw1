import {Router} from "express";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {bloggersController} from "./bloggers-controller";
import {postsController} from "../posts/posts-controller";
import {bloggerValidation} from "./validation";
import {postValidation} from "../posts/validation";


export const bloggersRouter = Router()

bloggersRouter
    .get('/', bloggersController.getBloggers)

    .post('/', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.createNewBlogger)

    .get('/:id', bloggersController.getBloggerById)

    .put('/:id', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.updateBlogger)

    .delete('/:id', authMiddlewareBasic, bloggersController.deleteBlogger)

    .get('/:bloggerId/posts', postsController.getBloggerPosts)

    .post('/:bloggerId/posts', authMiddlewareBasic, postValidation, validationMiddleware, postsController.createNewBloggerPost)