import {Router} from "express";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {commentsController} from "./comments-controller";
import {commentValidation} from "./validation";
import {validateLikesValueMiddleware} from "../../middlewares/validateLikesValue-middleware";
import {checkUserMiddleware} from "../../middlewares/checkUser-middleware";

export const commentsRouter = Router()

commentsRouter
    .get('/:id', checkUserMiddleware, commentsController.getCommentById)

    .delete('/:commentId', authMiddlewareBearer, commentsController.deleteCommentById)

    .put('/:commentId', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.updateComment)

    .put('/:commentId/like-status', authMiddlewareBearer, validateLikesValueMiddleware, validationMiddleware, commentsController.likeComment)