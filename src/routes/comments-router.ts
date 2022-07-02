import {Router} from "express";
import {authMiddlewareBearer} from "../middlewares/auth-middleware-bearer";
import {commentValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {commentsController} from "../controllers/comments-controller";

export const commentsRouter = Router()

commentsRouter
    .get('/:id', commentsController.getCommentById)

    .delete('/:commentId', authMiddlewareBearer,commentsController.deleteCommentById)

    .put('/:commentId', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.updateComment)