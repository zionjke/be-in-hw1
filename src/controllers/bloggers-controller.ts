import {Request, Response} from "express";
import {bloggersService} from "../domain/bloggers-service";

export const bloggersController = {
    async getBloggers(req: Request, res: Response) {
        try {
            const searchNameTerm = req.query.SearchNameTerm ? req.query.SearchNameTerm.toString() : undefined

            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await bloggersService.getBloggers(searchNameTerm, pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to get all bloggers')
        }
    },

    async createNewBlogger(req: Request, res: Response) {
        try {
            const {name, youtubeUrl} = req.body;

            const blogger = await bloggersService.createNewBlogger(name, youtubeUrl)

            res.status(201).send(blogger)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to create blogger')
        }
    },

    async getBloggerById(req: Request, res: Response) {
        try {
            const {id} = req.params

            const blogger = await bloggersService.getBloggerById(id)

            if (blogger) {
                res.status(200).send(blogger)
            } else {
                res.status(404).send('Blogger Not found')
            }
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to get blogger')
        }
    },

    async updateBlogger(req: Request, res: Response) {
        try {
            const {id} = req.params

            const {name, youtubeUrl} = req.body;

            const isUpdated = await bloggersService.updateBlogger(id, name, youtubeUrl)

            if (isUpdated) {
                res.sendStatus(204)
            } else {
                res.status(404).send('Blogger not found')
            }
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to update blogger')
        }
    },

    async deleteBlogger(req: Request, res: Response) {
        try {
            const {id} = req.params

            const isDeleted = await bloggersService.deleteBlogger(id)

            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404).send('Blogger Not found')
            }
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to delete blogger')
        }
    },

    async getBloggerPosts(req: Request, res: Response) {
        try {
            const {bloggerId} = req.params

            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (!blogger) {
                res.status(404).send('Blogger not found')
                return;
            }

            const data = await bloggersService.getBloggerPosts(bloggerId, pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to get blogger posts')
        }
    },

    async createNewBloggerPost(req: Request, res: Response) {
        try {
            const {bloggerId} = req.params

            const {title, shortDescription, content} = req.body

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (!blogger) {
                res.status(404).send('Blogger not found')
                return;
            }

            const post = await bloggersService.createNewBloggerPost(title, shortDescription, content, blogger)

            res.status(201).send(post)
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to create blogger posts')
        }
    }

}