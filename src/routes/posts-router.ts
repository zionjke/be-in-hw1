import {Router} from "express";
import {bloggerIdValidation, commentValidation, postValidation} from "../middlewares/validationMiddleware";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../middlewares/auth-middleware-basic";
import {authMiddlewareBearer} from "../middlewares/auth-middleware-bearer";
import {postsController} from "../controllers/posts-controller";

export const postsRouter = Router()

postsRouter
    .get('/', postsController.getPosts)

    .post('/', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.createPost)

    .get('/:id', postsController.getPostById)

    .put('/:id', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.updatePost)

    .delete('/:id', authMiddlewareBasic, postsController.deletePost)

    .post('/:postId/comments', authMiddlewareBearer, commentValidation, validationMiddleware, postsController.createPostComment)

    .get('/:postId/comments', postsController.getPostComments)