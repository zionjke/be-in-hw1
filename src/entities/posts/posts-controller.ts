import {NextFunction, Request, Response} from "express";
import {postsService} from "./posts-service";

export const postsController = {
    async getPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await postsService.getPosts(pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    },

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, shortDescription, content, bloggerId} = req.body

            const post = await postsService.createPost(title, shortDescription, content, bloggerId)

            res.status(201).send(post)
        } catch (error) {
            next(error)
        }
    },

    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const userId = req.user?.id

            const post = await postsService.getPostById(id, userId)

            res.status(200).send(post)
        } catch (error) {
            next(error)
        }
    },

    async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const {title, shortDescription, content, bloggerId} = req.body

            await postsService.updatePost(id, title, shortDescription, content, bloggerId)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            await postsService.deletePost(id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },

    async getBloggerPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const {bloggerId} = req.params

            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await postsService.getBloggerPosts(bloggerId, pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    },

    async createNewBloggerPost(req: Request, res: Response, next: NextFunction) {
        try {
            const {bloggerId} = req.params

            const {title, shortDescription, content} = req.body

            const post = await postsService.createNewBloggerPost(title, shortDescription, content, bloggerId)

            res.status(201).send(post)
        } catch (error) {
            next(error)
        }
    },

    async likePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {postId} = req.params

            const {likeStatus} = req.body

            const user = req.user

            await postsService.likePost(postId, likeStatus, user)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }
}
