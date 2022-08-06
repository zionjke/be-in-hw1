import {NextFunction, Request, Response} from "express";
import {bloggersService} from "./bloggers-service";

export const bloggersController = {
    async getBloggers(req: Request, res: Response, next: NextFunction) {
        try {
            const searchNameTerm = req.query.SearchNameTerm ? req.query.SearchNameTerm.toString() : undefined

            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await bloggersService.getBloggers(searchNameTerm, pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            next(error) // Передаем ошибку для обработки в middleware
        }
    },

    async createNewBlogger(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, youtubeUrl} = req.body;

            const blogger = await bloggersService.createNewBlogger(name, youtubeUrl)

            res.status(201).send(blogger)
        } catch (error) {
            next(error)
        }
    },

    async getBloggerById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const blogger = await bloggersService.getBloggerById(id)

            res.status(200).send(blogger)
        } catch (e) {
            next(e)
        }
    },

    async updateBlogger(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            const {name, youtubeUrl} = req.body;

            await bloggersService.updateBlogger(id, name, youtubeUrl)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },

    async deleteBlogger(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            await bloggersService.deleteBlogger(id)

            res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    },
}