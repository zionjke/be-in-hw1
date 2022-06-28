import {Request, Response, Router} from "express";
import {bloggerValidation, postValidation,} from "../middlewares/validationMiddleware";
import {bloggersService} from "../domain/bloggers-service";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/auth-middleware";


export const bloggersRouter = Router()

bloggersRouter

    .get('/', async (req: Request, res: Response) => {
        const searchNameTerm = req.query.SearchNameTerm

        const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

        const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

        const data = await bloggersService.getBloggers(searchNameTerm?.toString(), pageNumber, _pageSize)

        res.status(200).send(data)
    })

    .post('/', authMiddleware, bloggerValidation, validationMiddleware, async (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body;

        const blogger = await bloggersService.createNewBlogger(name, youtubeUrl)

        res.status(201).send(blogger)
    })

    .get('/:id', async (req: Request, res: Response) => {
        const {id} = req.params

        const blogger = await bloggersService.getBloggerById(id)

        if (blogger) {
            res.status(200).send(blogger)
        } else {
            res.status(404).send('Not found')
        }

    })

    .put('/:id', authMiddleware, bloggerValidation, validationMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id

        const {name, youtubeUrl} = req.body;

        const blogger = await bloggersService.getBloggerById(id)

        if (!blogger) {
            res.status(404).send('Not found')
            return
        }

        const isUpdated = await bloggersService.updateBlogger(id, name, youtubeUrl)

        if (isUpdated) {
            res.status(204).send('Blogger is updated')
        } else {
            res.status(500).send('Not updated')
        }
    })

    .delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id

        const isDeleted = await bloggersService.deleteBlogger(id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })

    .get('/:bloggerId/posts', async (req: Request, res: Response) => {
        const bloggerId = req.params.bloggerId

        const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

        const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

        const blogger = await bloggersService.getBloggerById(bloggerId)

        if (blogger) {

            const data = await bloggersService.getAllBloggerPosts(bloggerId, pageNumber, _pageSize)

            res.status(200).send(data)
        } else {
            return res.status(404).send('blogger is not exists')
        }

    })

    .post('/:bloggerId/posts',
        authMiddleware,
        postValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = req.params.bloggerId

            const {title, shortDescription, content} = req.body

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (blogger) {
                const post = await bloggersService.createNewBloggerPost(title, shortDescription, content, blogger)
                res.status(201).send(post)
            } else {
                res.status(404).send('blogger doesn\'t exists')
            }
        })