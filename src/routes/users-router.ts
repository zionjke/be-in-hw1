import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersService} from "../domain/users-service";
import {userValidation, validationMiddleware} from "../middlewares/validationMiddleware";

export const usersRouter = Router();

usersRouter

    .get('/', async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

        const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

        const data = await usersService.getUsers(pageNumber, _pageSize)

        res.status(200).send(data)

    })

    .post('/', authMiddleware, userValidation, validationMiddleware, async (req: Request, res: Response) => {
        const {login, password} = req.body

        const user = await usersService.createUser(login, password)

        res.status(201).send(user)
    })

    .delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = await usersService.deleteUser(id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.sendStatus(404).send('User Not found')
        }
    })