import express, {Request, Response} from 'express'
import cors from 'cors'

import {runDb} from "./db";

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {globalCatch} from "./m5-catchErrors";

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!')
})

//with Mockdata
// app.use('/bloggers', bloggersRouterWithMock)
// app.use('/posts', postsRouterWithMock)

//with NativeMongo
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


globalCatch()

const start = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

start()