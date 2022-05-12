import {Request, Response, Router} from "express";
import {
    bloggerIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validationMiddleware";
import {postsRepository} from "../repositories/posts-repository";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts()
    res.status(200).send(posts)
})
postsRouter.post('/',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    validationMiddleware,
    (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body
        const blogger = bloggersRepository.getBloggerById(+bloggerId)

        if (!blogger) {
            res.status(400).send('Not found')
            return
        }
        const newPost = postsRepository.createPost(title, shortDescription, content, blogger)
        res.status(201).send(newPost)
    })
postsRouter.get('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const post = postsRepository.getPostById(+id)

    if (post) {
        res.status(200).send(post)
    } else {
        res.status(404).send('Not found')
    }
})
postsRouter.put('/:id',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    validationMiddleware,
    (req: Request, res: Response) => {
        const {id} = req.params
        const {title, shortDescription, content, bloggerId} = req.body

        const blogger = bloggersRepository.getBloggerById(+bloggerId)

        if (!blogger) {
            res.status(400).send('Not found')
            return
        }

        const isUpdated = postsRepository.updatePost(+id, title, shortDescription, content, blogger)

        if (isUpdated) {
            res.send(204)
        }
    })
postsRouter.delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const isDeleted = postsRepository.deletePost(+id)

    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})