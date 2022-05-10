import express, {Request, Response} from 'express'
import cors from 'cors'

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World!')
})

app.use('/bloggers',bloggersRouter)
app.use('/posts', postsRouter)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})