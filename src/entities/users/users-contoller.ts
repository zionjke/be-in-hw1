import {NextFunction, Request, Response} from "express";
import {UsersService} from "./users-service";


export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const data = await this.usersService.getUsers(pageNumber, _pageSize)

            res.status(200).send(data)
        } catch (error) {
            next(error)
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {login, password, email} = req.body

            const user = await this.usersService.createUser(login, password, email)

            res.status(201).send({
                id: user.id,
                login: user.login
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params

            await this.usersService.deleteUser(id)

            res.send(204)
        } catch (error) {
            next(error)
        }
    }
}

