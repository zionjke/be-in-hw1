import {Request, Response, Router} from "express";
import {
    bloggerIdValidation,
    contentValidation, myValidationResult,
    sendError,
    shortDescriptionValidation,
    titleValidation
} from "../validation";
import {postsRepository} from "../repositories/posts-repository";
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
    (req: Request, res: Response) => {
        const {title, shortDescription, content, bloggerId} = req.body

        const errors = myValidationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json(sendError(errors))
        }
        const blogger = bloggersRepository.getBloggerById(bloggerId)

        const newPost = postsRepository.createPost(title, shortDescription, content, blogger)

        if (blogger) {
            res.status(201).send(newPost)
        } else {
            res.status(404).send('Not found')
        }
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
    (req: Request, res: Response) => {
        const {id} = req.params
        const {title, shortDescription, content, bloggerId} = req.body

        const errors = myValidationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json(sendError(errors))
        }

        const isUpdated = postsRepository.updatePost(+id, title, shortDescription, content, bloggerId)

        if (isUpdated) {
            res.send(204)
        } else {
            res.status(404).send('Not Found')
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