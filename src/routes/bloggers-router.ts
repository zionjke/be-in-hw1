import {Request, Response, Router} from "express";
import {nameValidation, urlValidation} from "../middlewares/validationMiddleware";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/auth-middleware";


export const bloggersRouter = Router()

bloggersRouter
    .get('/', async (req: Request, res: Response) => {
        const {name} = req.query

        const bloggers = await bloggersService.getBloggers(name?.toString())

        res.status(200).send(bloggers)
    })
    .post('/', authMiddleware, nameValidation, urlValidation, validationMiddleware, async (req: Request, res: Response) => {
        debugger;
        const {name, youtubeUrl} = req.body;

        const blogger = await bloggersService.createNewBlogger(name, youtubeUrl)

        res.status(201).send(blogger)
    })
    .get('/:id', async (req: Request, res: Response) => {
        const {id} = req.params

        const blogger = await bloggersService.getBloggerById(+id)

        blogger ? res.status(200).send(blogger) : res.status(404).send('Not found')
    })
    .put('/:id', authMiddleware, nameValidation, urlValidation, validationMiddleware, async (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body;
        const {id} = req.params

        const isUpdated = await bloggersService.updateBlogger(+id, name, youtubeUrl)

        if (isUpdated) {
            res.status(204).send('Blogger is updated')
        } else {
            res.status(404).send('Not found')
        }
    })
    .delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = await bloggersService.deleteBlogger(+id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })