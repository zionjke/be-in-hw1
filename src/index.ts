import express, {Request, Response} from 'express'
import cors from 'cors'

import {runDb} from "./db";

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {globalCatch} from "./m5-catchErrors";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {authLimiter} from "./utils/limiter";


const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send(`SERVER  IS RUNNING ON ${port} PORT`)
})

//with Mockdata
// app.use('/bloggers', bloggersRouterWithMock)
// app.use('/posts', postsRouterWithMock)

//with NativeMongo
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)


globalCatch()

const start = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

start()