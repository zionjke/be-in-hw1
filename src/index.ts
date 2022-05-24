import express, {Request, Response} from 'express'
import cors from 'cors'

import {runDb} from "./db";

import {bloggersRouter} from "./routes/bloggers-router";

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!')
})

//with Mockdata
// app.use('/bloggers', bloggersRouterWithMock)
// app.use('/posts', postsRouter)

//with NativeMongo
app.use('/bloggers', bloggersRouter)


const start = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

start()