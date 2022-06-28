import {Request, Response, Router} from "express";
import {bloggerIdValidation, postValidation,} from "../middlewares/validationMiddleware";
import {postsRepositoryWithMock} from "../repositories/posts-repository-withMock";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {bloggersRepositoryWithMock} from "../repositories/bloggers-repository-withMock";
import {authMiddleware} from "../middlewares/auth-middleware";

export const postsRouterWithMock = Router()

postsRouterWithMock
    .get('/', (req: Request, res: Response) => {
        const posts = postsRepositoryWithMock.getAllPosts()
        res.status(200).send(posts)
    })

    .post('/',
        authMiddleware,
        postValidation,
        bloggerIdValidation,
        validationMiddleware,
        (req: Request, res: Response) => {
            const {title, shortDescription, content, bloggerId} = req.body
            const newPost = postsRepositoryWithMock.createPost(title, shortDescription, content, bloggerId)
            res.status(201).send(newPost)
        }
    )

    .get('/:id', (req: Request, res: Response) => {
        const {id} = req.params

        const post = postsRepositoryWithMock.getPostById(id)

        if (post) {
            res.status(200).send(post)
        } else {
            res.status(404).send('Not found')
        }
    })
    .put('/:id',
        authMiddleware,
        postValidation,
        bloggerIdValidation.custom((value) => {
            const blogger = bloggersRepositoryWithMock.getBloggerById(value)
            if (!blogger) {
                throw new Error()
            }
            return true
        }),
        validationMiddleware,
        (req: Request, res: Response) => {
            const {id} = req.params
            const {title, shortDescription, content, bloggerId} = req.body

            const isUpdated = postsRepositoryWithMock.updatePost(id, title, shortDescription, content, bloggerId)

            if (isUpdated) {
                res.send(204)
            } else {
                res.send(404)
            }
        })

    .delete('/:id', authMiddleware, (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = postsRepositoryWithMock.deletePost(id)

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })