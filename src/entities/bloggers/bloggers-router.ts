import {Router} from "express";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {bloggerValidation} from "./validation";
import {postValidation} from "../posts/validation";
import {checkUserMiddleware} from "../../middlewares/checkUser-middleware";
import {bloggersController, postsController} from "../../composition-root";


export const bloggersRouter = Router()

bloggersRouter
    .get('/', bloggersController.getBloggers.bind(bloggersController))

    .post('/', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.createNewBlogger.bind(bloggersController))

    .get('/:id', bloggersController.getBloggerById.bind(bloggersController))

    .put('/:id', authMiddlewareBasic, bloggerValidation, validationMiddleware, bloggersController.updateBlogger.bind(bloggersController))

    .delete('/:id', authMiddlewareBasic, bloggersController.deleteBlogger.bind(bloggersController))

    .get('/:bloggerId/posts',checkUserMiddleware, postsController.getBloggerPosts.bind(postsController))

    .post('/:bloggerId/posts', authMiddlewareBasic, postValidation, validationMiddleware, postsController.createNewBloggerPost.bind(postsController))
