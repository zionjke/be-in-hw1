import {NextFunction, Request, Response} from "express";
import {CommentsService} from "./comments-service";
import {injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async getCommentById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const userId = req.user?.id

            const comment = await this.commentsService.getCommentById(id, userId)

            res.status(200).send(comment)
        } catch (error) {
            next(error)
        }
    }

    async deleteCommentById(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const user = req.user

            await this.commentsService.deleteCommentById(commentId, user.id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const {content} = req.body

            const user = req.user

            await this.commentsService.updateComment(commentId, content, user.id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }

    async createPostComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {postId} = req.params

            const user = req.user

            const {content} = req.body

            const comment = await this.commentsService.createPostComment(content, postId, user)

            res.status(201).send(comment)
        } catch (error) {
            next(error)
        }
    }

    async getPostComments(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const {postId} = req.params

            const userId = req.user?.id

            const data = await this.commentsService.getPostComments(postId, pageNumber, _pageSize, userId)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    }

    async likeComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {commentId} = req.params

            const {likeStatus} = req.body

            const user = req.user

            await this.commentsService.likeComment(commentId, likeStatus, user)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }
}

