import {Request, Response, Router} from "express";
import {
    bloggerIdValidation,
    contentValidation, sendError,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validationMiddleware";
import {postsRepository} from "../repositories/posts-repository";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {bloggersRepositoryWithMock} from "../repositories/bloggers-repository-withMock";
import {authMiddleware} from "../middlewares/auth-middleware";

export const postsRouter = Router()

postsRouter
    .get('/', (req: Request, res: Response) => {
        const posts = postsRepository.getAllPosts()
        res.status(200).send(posts)
    })

    .post('/',
        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        bloggerIdValidation,
        validationMiddleware,
        (req: Request, res: Response) => {
            const {title, shortDescription, content, bloggerId} = req.body
            const newPost = postsRepository.createPost(title, shortDescription, content, +bloggerId)
            res.status(201).send(newPost)
        })

    .get('/:id', (req: Request, res: Response) => {
        const {id} = req.params

        const post = postsRepository.getPostById(+id)

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
        bloggerIdValidation.custom((value) => {
            const blogger = bloggersRepositoryWithMock.getBloggerById(+value)
            if (!blogger) {
                throw new Error()
            }
            return true
        }),
        validationMiddleware,
        (req: Request, res: Response) => {
            const {id} = req.params
            const {title, shortDescription, content, bloggerId} = req.body

            const isUpdated = postsRepository.updatePost(+id, title, shortDescription, content, +bloggerId)

            if (isUpdated) {
                res.send(204)
            } else {
                res.send(404)
            }
        })

    .delete('/:id', authMiddleware, (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = postsRepository.deletePost(+id)

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })