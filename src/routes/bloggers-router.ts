import {Request, Response, Router} from "express";
import {sendError, validateUrl} from "../validation";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersRouter = Router()

bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.geBloggers()
    res.status(200).send(bloggers)
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


    const newBlogger = bloggersRepository.createNewBlogger(name, youtubeUrl)
    res.status(201).send(newBlogger)
})
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const blogger = bloggersRepository.getBloggerById(+id)

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


    const isUpdated = bloggersRepository.updateBlogger(+id, name, youtubeUrl)

    if (isUpdated) {
        const blogger = bloggersRepository.getBloggerById(+id)
        res.status(204).send(blogger)
    } else {
        res.status(404).send('Not found')
    }
})
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const isDeleted = bloggersRepository.deleteBlogger(+id)

    if (isDeleted) {
        res.send(204)
    } else {
        res.sendStatus(404).send('Not found')
    }
})