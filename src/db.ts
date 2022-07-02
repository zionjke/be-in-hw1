import {MongoClient} from 'mongodb'
import {BloggerType, CommentDBType, PostType, UserDBType} from "./types";

const mongoUri = process.env.mongoURI || "mongodb+srv://admin:eok2Ydkm21249@cluster0.arx9w.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db('social-network').collection<BloggerType>('bloggers')

export const postsCollection = client.db('social-network').collection<PostType>('posts')

export const usersCollection = client.db('social-network').collection<UserDBType>('users')

export const commentsCollection = client.db('social-network').collection<CommentDBType>('comments')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("social-network").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
