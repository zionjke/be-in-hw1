import {NextFunction, Request, Response} from "express";
import {PostsService} from "./posts-service";
import {injectable} from "inversify";

@injectable()
export class PostsController {
     constructor(protected postsService: PostsService) {}

    async getPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const userId = req.user?.id

            const data = await this.postsService.getPosts(pageNumber, _pageSize, userId)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, shortDescription, content, bloggerId} = req.body

            const post = await this.postsService.createPost(title, shortDescription, content, bloggerId)

            res.status(201).send(post)
        } catch (error) {
            next(error)
        }
    }

    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const userId = req.user?.id

            const post = await this.postsService.getPostById(id, userId)

            res.status(200).send(post)
        } catch (error) {
            next(error)
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const {title, shortDescription, content, bloggerId} = req.body

            await this.postsService.updatePost(id, title, shortDescription, content, bloggerId)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            await this.postsService.deletePost(id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }

    async getBloggerPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const {bloggerId} = req.params

            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const userId = req.user?.id

            const data = await this.postsService.getBloggerPosts(bloggerId, pageNumber, _pageSize, userId)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    }

    async createNewBloggerPost(req: Request, res: Response, next: NextFunction) {
        try {
            const {bloggerId} = req.params

            const {title, shortDescription, content} = req.body

            const post = await this.postsService.createNewBloggerPost(title, shortDescription, content, bloggerId)

            res.status(201).send(post)
        } catch (error) {
            next(error)
        }
    }

    async likePost(req: Request, res: Response, next: NextFunction) {
        try {
            const {postId} = req.params

            const {likeStatus} = req.body

            const user = req.user

            await this.postsService.likePost(postId, likeStatus, user)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }
}

