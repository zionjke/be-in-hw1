import express, {Request, Response} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {runDb} from "./db";

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {globalCatch} from "./m5-catchErrors";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {deleteAllDataFromDB} from "./utils/deleteAllDataFromDB";
import {checkIp} from "./utils/limiter";


const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.set('trust-proxy', true)

app.use(express.json())

app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send(`SERVER  IS RUNNING ON ${port} PORT`)
})

//with Mockdata
// app.use('/bloggers', bloggersRouterWithMock)
// app.use('/posts', postsRouterWithMock)

//with NativeMongo
app.use('/users', usersRouter)
app.use('/auth', checkIp, authRouter)
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


globalCatch()

const start = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

start()