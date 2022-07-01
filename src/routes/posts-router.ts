import {Request, Response, Router} from "express";
import {bloggerIdValidation, commentValidation, postValidation} from "../middlewares/validationMiddleware";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {bloggersService} from "../domain/bloggers-service";
import {authMiddlewareBearer} from "../middlewares/auth-middleware-bearer";

export const postsRouter = Router()

postsRouter
    .get('/', async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

        const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

        const data = await postsService.getAllPosts(pageNumber, _pageSize)

        res.status(200).send(data)
    })

    .post('/',
        authMiddleware,
        postValidation,
        bloggerIdValidation.custom(async (value) => {

            const blogger = await bloggersService.getBloggerById(value)

            if (!blogger) {
                throw new Error()
            }
            return true
        }),
        validationMiddleware,
        async (req: Request, res: Response) => {
            const {title, shortDescription, content, bloggerId} = req.body

            const newPost = await postsService.createPost(title, shortDescription, content, bloggerId)

            res.status(201).send(newPost)
        })

    .get('/:id', async (req: Request, res: Response) => {
        const {id} = req.params

        const post = await postsService.getPostById(id)

        if (post) {
            res.status(200).send(post)
        } else {
            res.status(404).send('Not found')
        }
    })
    .put('/:id',
        authMiddleware,
        postValidation,
        bloggerIdValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {
            const {id} = req.params

            const {title, shortDescription, content, bloggerId} = req.body

            const post = await postsService.getPostById(id)

            if (!post) {
                res.status(404).send('Post not Found')
                return
            }

            const blogger = await bloggersService.getBloggerById(bloggerId)

            if (!blogger) {
                return res.status(404).send('Blogger not found')
            }

            const isUpdated = await postsService.updatePost(id, title, shortDescription, content, blogger)

            if (isUpdated) {
                res.status(204).send('Post updated')
            } else {
                res.status(404).send('Post not updated')
            }
        })

    .delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const {id} = req.params

        const isDeleted = await postsService.deletePost(id)

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })

    .post('/:postId/comments',
        authMiddlewareBearer,
        commentValidation,
        validationMiddleware,
        async (req: Request, res: Response) => {

            const {postId} = req.params

            const {user} = req

            const {content} = req.body

            const post = await postsService.getPostById(postId)

            if (!post) {
                res.status(404).send('Post doesn\'t exists')
                return;
            }

            const comment = await postsService.createPostComment(content, user)

            if (!comment) {
                res.sendStatus(401)
                return;
            }

            res.status(201).send(comment)

        })

        .get('/:postId/comments', async (req: Request, res: Response) => {
            const pageNumber = req.query.PageNumber ? +req.query.PageNumber : undefined

            const _pageSize = req.query.PageSize ? +req.query.PageSize : undefined

            const {postId} = req.params

            const post = await postsService.getPostById(postId)

            if (!post) {
                res.status(404).send('Post doesn\'t exists')
                return;
            }

            const data = await postsService.getAllCommentsPost(pageNumber, _pageSize)

            res.status(200).send(data)

        })