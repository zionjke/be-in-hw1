import {Request, Response, Router} from "express";
import {BLOGGERS, BloggerType} from "../constants";
import {sendError, validateUrl} from "../validation";

export const bloggersRouter = Router()

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(BLOGGERS)
})
bloggersRouter.get('/:bloggerName', (req: Request, res: Response) => {
    const {bloggerName} = req.params
    const blogger = BLOGGERS.find(b => b.name === bloggerName)
    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.status(404).send('Not Found')
    }

})
bloggersRouter.post('/', (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body;

    const nameValidation = !name || name.length > 15 || typeof name !== 'string'
    const urlValidation = !validateUrl(youtubeUrl) || !youtubeUrl || youtubeUrl.length > 100 || typeof youtubeUrl !== 'string'

    if (nameValidation) {
        res.status(400).send(sendError('name', 'name is incorrect'))
        return;
    }

    if (urlValidation) {
        res.status(400).send(sendError('youtubeUrl', 'youtubeUrl is incorrect'))
        return;
    }


    const newBlogger: BloggerType = {
        id: +(new Date()),
        name,
        youtubeUrl
    }
    BLOGGERS.push(newBlogger)
    res.status(201).send(newBlogger)
})
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const blogger = BLOGGERS.find(blogger => blogger.id === +id)

    blogger ? res.status(200).send(blogger) : res.status(404).send('Not found')
})
bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body;
    const {id} = req.params

    const nameValidation = !name || name.length > 15 || typeof name !== 'string'
    const urlValidation = !validateUrl(youtubeUrl) || (!youtubeUrl || youtubeUrl.length > 100 || typeof youtubeUrl !== 'string')

    if (nameValidation) {
        res.status(400).send(sendError('name', 'name is incorrect'))
        return
    }

    if (urlValidation) {
        res.status(400).send(sendError('youtubeUrl', 'youtubeUrl is incorrect'))
        return
    }

    if (nameValidation || urlValidation) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "string",
                    field: "name"
                },
                {
                    message: "string",
                    field: "youtubeUrl"
                },

            ],
            resultCode: 1
        })
        return;
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
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const bloggerIndex = BLOGGERS.findIndex(b => b.id === +id)

    if (bloggerIndex >= 0) {
        BLOGGERS.splice(bloggerIndex, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})