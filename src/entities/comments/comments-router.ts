import {Router} from "express";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {commentsController} from "./comments-controller";
import { commentValidation } from "./validation";

export const commentsRouter = Router()

commentsRouter
    .get('/:id', commentsController.getCommentById)

    .delete('/:commentId', authMiddlewareBearer,commentsController.deleteCommentById)

    .put('/:commentId', authMiddlewareBearer, commentValidation, validationMiddleware, commentsController.updateComment)