import {Request, Response} from "express";
import {commentsService} from "./comments-service";
import {postsService} from "../posts/posts-service";

export const commentsController = {
    async getCommentById(req: Request, res: Response) {
        try {
            const {id} = req.params

            const comment = await commentsService.getCommentById(id)

            res.status(200).send(comment)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to get comment')
        }
    },

    async deleteCommentById(req: Request, res: Response) {
        try {
            const {commentId} = req.params

            const user = req.user

            await commentsService.deleteCommentById(commentId, user.id)

            res.sendStatus(204)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to delete comment')
        }
    },

    async updateComment(req: Request, res: Response) {
        try {
            const {commentId} = req.params

            const {content} = req.body

            const user = req.user

            await commentsService.updateComment(commentId, content, user.id)

            res.sendStatus(204)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to update comment')
        }
    },

    async createPostComment(req: Request, res: Response) {
        try {
            const {postId} = req.params

            const user = req.user

            const {content} = req.body

            const comment = await commentsService.createPostComment(content, postId, user)

            res.status(201).send(comment)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to create post comments')
        }
    },

    async getPostComments(req: Request, res: Response) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const {postId} = req.params

            const data = await commentsService.getPostComments(postId, pageNumber, _pageSize,)

            res.status(200).send(data)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to get post comments')
        }
    },
}