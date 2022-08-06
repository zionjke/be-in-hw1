import express, {Request, Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {runDb} from "./db";

import {bloggersRouter} from "./entities/bloggers/bloggers-router";
import {postsRouter} from "./entities/posts/posts-router";
import {usersRouter} from "./entities/users/users-router";
import {authRouter} from "./entities/auth/auth-router";
import {commentsRouter} from "./entities/comments/comments-router";
import {deleteAllDataFromDB} from "./utils/deleteAllDataFromDB";
import {errorMiddleware} from "./middlewares/error-middleware";
import {checkRequestsLimit} from "./middlewares/requestsLimits-middleware";


const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.set('trust-proxy', true)

app.use(express.json())

app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send(`SERVER  IS RUNNING ON ${port} PORT`)
})


app.use('/users', usersRouter)
app.use('/auth', checkRequestsLimit, authRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    try {
        await deleteAllDataFromDB()
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
    }
})


app.use(errorMiddleware)

// globalCatch()

const start = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

start()