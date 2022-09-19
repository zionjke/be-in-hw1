import {Router} from "express";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {commentValidation} from "./validation";
import {validateLikesValueMiddleware} from "../../middlewares/validateLikesValue-middleware";
import {checkUserMiddleware} from "../../middlewares/checkUser-middleware";
import {container} from "../../composition-root";
import {CommentsController} from "./comments-controller";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router()

commentsRouter
    .get('/:id', checkUserMiddleware, commentsController.getCommentById.bind(commentsController))

    .delete('/:commentId', authMiddlewareBearer, commentsController.deleteCommentById.bind(commentsController))

    .put('/:commentId', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.updateComment.bind(commentsController))

    .put('/:commentId/like-status', authMiddlewareBearer, validateLikesValueMiddleware, validationMiddleware, commentsController.likeComment.bind(commentsController))
