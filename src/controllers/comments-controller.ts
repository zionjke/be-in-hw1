import {Request, Response} from "express";
import {commentsService} from "../domain/comments-service";

export const commentsController = {
    async getCommentById(req: Request, res: Response) {
        try {
            const {id} = req.params

            const comment = await commentsService.getCommentById(id)

            if (!comment) {
                res.status(404).send('Comment not found')
                return;
            }

            res.status(200).send(comment)
        } catch {
            res.status(500).send('Failed to get comment')
        }
    },

    async deleteCommentById(req: Request, res: Response) {
        try {
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
        } catch {
            res.status(500).send('Failed to delete comment')
        }
    },

    async updateComment(req: Request, res: Response) {
        try {
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
        } catch {
            res.status(500).send('Failed to update comment')
        }
    }
}