import {Router} from "express";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {postsController} from "./posts-controller";
import {bloggerIdValidation, postValidation} from "./validation";
import {commentsController} from "../comments/comments-controller";
import {commentValidation} from "../comments/validation";
import {checkUserMiddleware} from "../../middlewares/checkUser-middleware";

export const postsRouter = Router()

postsRouter
    .get('/', postsController.getPosts)

    .post('/', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.createPost)

    .get('/:id', postsController.getPostById)

    .put('/:id', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.updatePost)

    .delete('/:id', authMiddlewareBasic, postsController.deletePost)

    .post('/:postId/comments', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.createPostComment)

    .get('/:postId/comments', checkUserMiddleware, commentsController.getPostComments)