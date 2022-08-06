import {MongoClient} from 'mongodb'
import {IpRequestType,} from "./types";
import {SERVICE} from "./constants";
import { BloggerType } from './entities/bloggers/types';
import { PostType } from './entities/posts/types';
import { UserDBType } from './entities/users/types';
import { CommentDBType } from './entities/comments/types';
import {TokenType} from "./entities/tokens/types";

const mongoUri = process.env.mongoURI || SERVICE.URI;

export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db('social-network').collection<BloggerType>('bloggers')

export const postsCollection = client.db('social-network').collection<PostType>('posts')

export const usersCollection = client.db('social-network').collection<UserDBType>('users')

export const commentsCollection = client.db('social-network').collection<CommentDBType>('comments')

export const limitsCollection = client.db('social-network').collection<IpRequestType>('limits')

export const tokensCollection = client.db('social-network').collection<TokenType>('tokens')

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
