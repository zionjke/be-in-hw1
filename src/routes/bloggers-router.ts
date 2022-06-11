import {Request, Response, Router} from "express";
import {
    contentValidation,
    nameValidation,
    shortDescriptionValidation,
    titleValidation,
    urlValidation
} from "../middlewares/validationMiddleware";
import {bloggersService} from "../domain/bloggers-service";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/auth-middleware";


export const bloggersRouter = Router()

bloggersRouter
    .get('/', async (req: Request, res: Response) => {
        const {SearchNameTerm} = req.query

        const PageNumber: number = +req.query.PageNumber!

        const PageSize: number = +req.query.PageSize!

        const data = await bloggersService.getBloggers(SearchNameTerm?.toString(), PageNumber, PageSize)

        res.status(200).send(data)
    })
    .post('/', authMiddleware, nameValidation, urlValidation, validationMiddleware, async (req: Request, res: Response) => {
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
        const {id} = req.params

        const {name, youtubeUrl} = req.body;

        const blogger = await bloggersService.getBloggerById(+id)

        if (!blogger) {
            return res.status(404).send('Not found')
        }

        const isUpdated = await bloggersService.updateBlogger(+id, name, youtubeUrl)

        if (isUpdated) {
            res.status(204).send('Blogger is updated')
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
    .get('/:bloggerId/posts', async (req: Request, res: Response) => {
        const {bloggerId} = req.params

        const PageNumber: number = +req.query.PageNumber!

        const PageSize: number = +req.query.PageSize!

        const blogger = await bloggersService.getBloggerById(+bloggerId)

        if (!blogger) {
            return res.status(404).send('blogger is not exists')
        }

        const data = await bloggersService.getAllBloggerPosts(+bloggerId, PageNumber, PageSize)

        res.status(200).send(data)
    })
    .post('/:bloggerId/posts',
        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {
            const {bloggerId} = req.params

            const {title, shortDescription, content} = req.body

            const blogger = await bloggersService.getBloggerById(+bloggerId)

            if (blogger) {
                const post = await bloggersService.createNewBloggerPost(title, shortDescription, content, blogger)
                res.status(201).send(post)
            } else {
                res.status(404).send('blogger doesn\'t exists')
            }
        })