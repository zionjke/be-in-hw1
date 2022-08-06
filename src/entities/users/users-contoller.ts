import {NextFunction, Request, Response} from "express";
import {usersService} from "./users-service";

export const usersController = {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await usersService.getUsers(pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    },

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {login, password, email} = req.body

            const user = await usersService.createUser(login, password, email)

            res.status(201).send(user)
        } catch (error) {
            next(error)
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            await usersService.deleteUser(id)

            res.send(204)
        } catch (error) {
            next(error)
        }
    }
}