import {Request, Response, Router} from "express";
import {BLOGGERS, POSTS, PostType} from "../constants";
import {sendError} from "../validation";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(POSTS)
})
postsRouter.post('/', (req: Request, res: Response) => {
    const {title, shortDescription, content, bloggerId} = req.body

    if (!title || title.length > 30 || typeof title !== 'string') {
        res.status(400).send(sendError('title', 'title is incorrect'))
        return
    }

    if (!shortDescription || title.length > 100 || typeof shortDescription !== 'string') {
        res.status(400).send(sendError('shortDescription', 'shortDescription is incorrect'))
        return;
    }

    if (!content || content.length > 1000 || typeof content !== 'string') {
        res.status(400).send(sendError('content', 'content is incorrect'))
        return;
    }

    if (!bloggerId || typeof bloggerId !== 'number') {
        res.status(400).send(sendError('bloggerId', 'bloggerId is incorrect'))
        return;
    }

    const blogger = BLOGGERS.find(b => b.id === bloggerId)

    if (blogger) {
        const newPost: PostType = {
            id: +(new Date()),
            title,
            content,
            shortDescription,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }
        POSTS.push(newPost)
        res.status(201).send(newPost)
    } else {
        res.status(404).send('Not found')
    }
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    try {
        const post = POSTS.find(p => p.id === +id)
        if (post) {
            res.status(200).send(post)
        } else {
            res.status(404).send('Not found')
        }
    } catch {
        res.send(400)
    }
})
postsRouter.put('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const {title, shortDescription, content, bloggerId} = req.body

    if (!title || title.length > 30 || typeof title !== 'string') {
        res.status(400).send(sendError('title', 'title is incorrect'))
        return
    }

    if (!shortDescription || title.length > 100 || typeof shortDescription !== 'string') {
        res.status(400).send(sendError('shortDescription', 'shortDescription is incorrect'))
        return;
    }

    if (!content || content.length > 1000 || typeof content !== 'string') {
        res.status(400).send(sendError('content', 'content is incorrect'))
        return;
    }

    if (!bloggerId || typeof bloggerId !== 'number') {
        res.status(400).send(sendError('bloggerId', 'bloggerId is incorrect'))
        return;
    }

    const post = POSTS.find(p => p.id === +id)
    if (post) {
        post.title = title,
            post.shortDescription = shortDescription,
            post.content = content,
            post.bloggerId = bloggerId
        res.status(204).send(post)
    } else {
        res.status(404).send('Not Found')
    }
})
postsRouter.delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const postIndex = POSTS.findIndex(p => p.id === +id)

    if (postIndex >= 0) {
        POSTS.splice(postIndex, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})