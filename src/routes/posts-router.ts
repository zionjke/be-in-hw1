import {Request, Response, Router} from "express";
import {
    bloggerIdValidation,
    contentValidation, sendError,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validationMiddleware";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {bloggersService} from "../domain/bloggers-service";

export const postsRouter = Router()

postsRouter
    .get('/', async (req: Request, res: Response) => {
        const {pageNumber, pageSize} = req.query
        // @ts-ignore
        const data = await postsService.getAllPosts(+pageNumber, +pageSize)

        res.status(200).send(data)
    })

    .post('/',
        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        bloggerIdValidation.custom( async (value) => {

            const blogger = await bloggersService.getBloggerById(+value)

            if (!blogger) {
                throw new Error()
            }
            return true
        }),
        validationMiddleware,
        async (req: Request, res: Response) => {
            const {title, shortDescription, content, bloggerId} = req.body

            const newPost = await postsService.createPost(title, shortDescription, content, +bloggerId)

            res.status(201).send(newPost)
        })

    .get('/:id', async (req: Request, res: Response) => {
        const {id} = req.params

        const post = await postsService.getPostById(+id)

        if (post) {
            res.status(200).send(post)
        } else {
            res.status(404).send('Not found')
        }
    })
    .put('/:id',
        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        bloggerIdValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {
            const {id} = req.params

            const {title, shortDescription, content, bloggerId} = req.body

            const post = await postsService.getPostById(+id)

            if (!post) {
                return res.status(404).send('Post not Found')
            }

            const blogger = await bloggersService.getBloggerById(+bloggerId)

            if(!blogger) {
                return res.status(404).send('Blogger not found')
            }

            const isUpdated = await postsService.updatePost(+id, title, shortDescription, content, blogger)

            if (isUpdated) {
                res.status(204).send('Post updated')
            }
        })

    .delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = await postsService.deletePost(+id)

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })