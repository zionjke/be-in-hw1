import express, {Request, Response} from 'express'
import cors from 'cors'
import {BLOGGERS, BloggerType, POSTS, PostType} from "./constants";
import {sendError, validateUrl} from "./validation";

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!')
})

app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(BLOGGERS)
})
app.post('/bloggers', (req: Request, res: Response) => {
    const {name} = req.body;
    const {youtubeUrl} = req.body;

    if (!name || name.length > 15 || typeof name !== 'string') {
        res.status(400).send(sendError('name', 'name is incorrect'))
        return
    }

    if (!validateUrl(youtubeUrl) || !youtubeUrl || youtubeUrl.length > 100 || typeof youtubeUrl !== 'string') {
        res.status(400).send(sendError('youtubeUrl', 'youtubeUrl is incorrect'))
        return
    }

    const newBlogger: BloggerType = {
        id: +(new Date()),
        name,
        youtubeUrl
    }
    BLOGGERS.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.get('/bloggers/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const blogger = BLOGGERS.find(blogger => blogger.id === +id)

    blogger ? res.status(200).send(blogger) : res.status(404).send('Not found')
})
app.put('/bloggers/:id', (req: Request, res: Response) => {
    const {name} = req.body;
    const {id} = req.params
    const {youtubeUrl} = req.body;

    if (!name || name.length > 15 || typeof name !== 'string') {
        res.status(400).send(sendError('name', 'name is incorrect'))
        return
    }

    if (!validateUrl(youtubeUrl) || (!youtubeUrl || youtubeUrl.length > 100 || typeof youtubeUrl !== 'string')) {
        res.status(400).send(sendError('youtubeUrl', 'youtubeUrl is incorrect'))
        return
    }

    const blogger = BLOGGERS.find(b => b.id === +id)

    if (blogger) {
        blogger.name = name;
        blogger.youtubeUrl = youtubeUrl;
        res.status(204).send(blogger)
    } else {
        res.status(404).send('Not found')
    }
})
app.delete('/bloggers/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const bloggerIndex = BLOGGERS.findIndex(b => b.id === +id)

    if (bloggerIndex >= 0) {
        BLOGGERS.splice(bloggerIndex, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})

app.get('/posts', (req: Request, res: Response) => {
    res.status(200).send(POSTS)
})
app.post('/posts', (req: Request, res: Response) => {
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
app.get('/posts/:id', (req: Request, res: Response) => {
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
app.put('/posts/:id', (req: Request, res: Response) => {
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
app.delete('/posts/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const postIndex = POSTS.findIndex(p => p.id === +id)

    if (postIndex >= 0) {
        POSTS.splice(postIndex, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})