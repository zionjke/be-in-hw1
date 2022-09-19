import {Router} from "express";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {bloggerIdValidation, postValidation} from "./validation";
import {commentValidation} from "../comments/validation";
import {checkUserMiddleware} from "../../middlewares/checkUser-middleware";
import {validateLikesValueMiddleware} from "../../middlewares/validateLikesValue-middleware";
import {container} from "../../composition-root";
import {PostsController} from "./posts-controller";
import {CommentsController} from "../comments/comments-controller";

const postsController = container.resolve(PostsController)
const commentsController = container.resolve(CommentsController)

export const postsRouter = Router()

postsRouter
    .get('/', checkUserMiddleware, postsController.getPosts.bind(postsController))

    .post('/', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.createPost.bind(postsController))

    .get('/:id', checkUserMiddleware, postsController.getPostById.bind(postsController))

    .put('/:id', authMiddlewareBasic, postValidation, bloggerIdValidation, validationMiddleware, postsController.updatePost.bind(postsController))

    .delete('/:id', authMiddlewareBasic, postsController.deletePost.bind(postsController))

    .post('/:postId/comments', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.createPostComment.bind(commentsController))

    .get('/:postId/comments', checkUserMiddleware, commentsController.getPostComments.bind(commentsController))

    .put('/:postId/like-status', authMiddlewareBearer, validateLikesValueMiddleware, validationMiddleware, postsController.likePost.bind(postsController))
