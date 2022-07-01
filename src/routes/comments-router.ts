import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {authMiddlewareBearer} from "../middlewares/auth-middleware-bearer";
import {commentValidation, validationMiddleware} from "../middlewares/validationMiddleware";

export const commentsRouter = Router()

commentsRouter
    .get('/:id', async (req: Request, res: Response) => {
        const {id} = req.params

        const comment = await commentsService.getCommentById(id)

        if (!comment) {
            res.status(404).send('Comment not found')
            return;
        }

        res.status(200).send(comment)

    })

    .delete('/:commentId', authMiddlewareBearer, async (req: Request, res: Response) => {
        const {commentId} = req.params

        const user = req.user

        const comment = await commentsService.getCommentById(commentId)

        if (user?.id !== comment?.userId) {
            res.status(403).send('Comment does not belong to you')
            return;
        }

        const isDeleted = await commentsService.deleteCommentById(commentId)

        if (!isDeleted) {
            res.status(404).send('Comment not found')
            return;
        }

        res.sendStatus(204)

    })

    .put('/:commentId',
        authMiddlewareBearer,
        commentValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {

            const {commentId} = req.params

            const {content} = req.body

            const user = req.user

            const comment = await commentsService.getCommentById(commentId)

            if (user?.id !== comment?.userId) {
                res.status(403).send('Comment does not belong to you')
                return;
            }

            const isUpdated = await commentsService.updateComment(commentId, content)

            if (!isUpdated) {
                res.status(404).send('Comment not found')
                return;
            }

            res.sendStatus(204)

        })