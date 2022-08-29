import {NextFunction, Request, Response} from "express";
import {commentsService} from "./comments-service";

export const commentsController = {
    async getCommentById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const user = req.user

            const comment = await commentsService.getCommentById(id, user.id)

            res.status(200).send(comment)
        } catch (error) {
            next(error)
        }
    },

    async deleteCommentById(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const user = req.user

            await commentsService.deleteCommentById(commentId, user.id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const {content} = req.body

            const userId = req.user?.id

            await commentsService.updateComment(commentId, content, userId)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },

    async createPostComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {postId} = req.params

            const user = req.user

            const {content} = req.body

            const comment = await commentsService.createPostComment(content, postId, user)

            res.status(201).send(comment)
        } catch (error) {
            next(error)
        }
    },

    async getPostComments(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const {postId} = req.params

            const userId = req.user?.id

            const data = await commentsService.getPostComments(postId, pageNumber, _pageSize, userId)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    },

    async likeComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const {likesStatus} = req.body

            const user = req.user

            await commentsService.likeComment(commentId, likesStatus, user)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },
}