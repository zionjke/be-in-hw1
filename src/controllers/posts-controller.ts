import {Request, Response} from "express";
import {postsService} from "../domain/posts-service";
import {bloggersService} from "../domain/bloggers-service";

export const postsController = {
    async getPosts(req: Request, res: Response) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await postsService.getPosts(pageNumber, _pageSize)

            res.status(200).send(data)
        } catch {
            res.status(500).send('Failed to get posts')
        }
    },

    async createPost(req: Request, res: Response) {
        try {
            const {title, shortDescription, content, bloggerId} = req.body

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (!blogger) {
                res.status(404).send('Blogger not found')
                return;
            }

            const newPost = await postsService.createPost(title, shortDescription, content, blogger)

            res.status(201).send(newPost)
        } catch {
            res.status(500).send('Failed to create post')
        }
    },

    async getPostById(req: Request, res: Response) {
        try {
            const {id} = req.params

            const post = await postsService.getPostById(id)

            if (post) {
                res.status(200).send(post)
            } else {
                res.status(404).send('Post Not found')
            }
        } catch {
            res.status(500).send('Failed to get post')
        }
    },

    async updatePost(req: Request, res: Response) {
        try {
            const {id} = req.params

            const {title, shortDescription, content, bloggerId} = req.body

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (!blogger) {
                res.status(404).send('Blogger not found')
                return;
            }

            const isUpdated = await postsService.updatePost(id, title, shortDescription, content, blogger)

            if (isUpdated) {
                res.sendStatus(204)
            } else {
                res.status(404).send('Post not found')
            }
        } catch {
            res.status(500).send('Failed to update post')
        }
    },

    async deletePost(req: Request, res: Response) {
        try {
            const {id} = req.params

            const isDeleted = await postsService.deletePost(id)

            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.status(404).send('Post Not found')
            }
        } catch {
            res.status(500).send('Failed to delete post')
        }
    },

    async createPostComment(req: Request, res: Response) {
        try {
            const {postId} = req.params

            const {user} = req

            const {content} = req.body

            if (!user) {
                res.sendStatus(401)
                return;
            }

            const post = await postsService.getPostById(postId)

            if (!post) {
                res.status(404).send('Post not found')
                return;
            }

            const comment = await postsService.createPostComment(content, postId, user )

            res.status(201).send(comment)
        } catch {
            res.status(500).send('Failed to create post comments')
        }
    },

    async getPostComments(req: Request, res: Response) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const {postId} = req.params

            const post = await postsService.getPostById(postId)

            if (!post) {
                res.status(404).send('Post not found')
                return;
            }

            const data = await postsService.getPostComments(pageNumber, _pageSize, postId)

            res.status(200).send(data)
        } catch {
            res.status(500).send('Failed to get post comments')
        }
    }
}
