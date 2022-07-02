import {Request, Response} from "express";
import {usersService} from "../domain/users-service";

export const usersController = {
    async getUsers(req: Request, res: Response) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await usersService.getUsers(pageNumber, _pageSize)

            res.status(200).send(data)
        } catch {
            res.status(500).send('Failed to get users')
        }
    },

    async createUser(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const user = await usersService.createUser(login, password)

            if (user) {
                res.status(201).send(user)
            } else {
                res.status(401).send('User with this login already exists')
            }
        } catch {
            res.status(500).send('Failed to create user')
        }
    },

    async deleteUser(req: Request, res: Response) {
        try {
            const {id} = req.params

            const isDeleted = await usersService.deleteUser(id)

            if (isDeleted) {
                res.send(204)
            } else {
                res.sendStatus(404).send('User Not found')
            }
        } catch {
            res.status(500).send('Failed to delete user')
        }
    }
}