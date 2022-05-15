import express, {NextFunction, Request, Response} from 'express'
import cors from 'cors'

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";

import {authMiddleware} from "./middlewares/auth-middleware";
import { checkContentType } from './middlewares/checkContent-middleware';


const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(authMiddleware)
// app.use(checkContentType('application/json'))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!')
})

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})