import {Request, Response, Router} from "express";
import {bloggersRepositoryWithMock} from "../repositories/bloggers-repository-withMock";
import {bloggerValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddlewareBasic} from "../middlewares/auth-middleware-basic";


export const bloggersRouterWithMock = Router()

bloggersRouterWithMock
    .get('/', (req: Request, res: Response) => {
        const bloggers = bloggersRepositoryWithMock.geBloggers()
        res.status(200).send(bloggers)
    })
    .post('/', authMiddlewareBasic, bloggerValidation, validationMiddleware, (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body;

        const newBlogger = bloggersRepositoryWithMock.createNewBlogger(name, youtubeUrl)
        res.status(201).send(newBlogger)
    })
    .get('/:id', (req: Request, res: Response) => {
        const {id} = req.params

        const blogger = bloggersRepositoryWithMock.getBloggerById(id)

        blogger ? res.status(200).send(blogger) : res.status(404).send('Not found')
    })
    .put('/:id', authMiddlewareBasic, bloggerValidation, validationMiddleware, (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body;
        const {id} = req.params


        const isUpdated = bloggersRepositoryWithMock.updateBlogger(id, name, youtubeUrl)

        if (isUpdated) {
            const blogger = bloggersRepositoryWithMock.getBloggerById(id)
            res.status(204).send(blogger)
        } else {
            res.status(404).send('Not found')
        }
    })
    .delete('/:id', authMiddlewareBasic, (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = bloggersRepositoryWithMock.deleteBlogger(id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })