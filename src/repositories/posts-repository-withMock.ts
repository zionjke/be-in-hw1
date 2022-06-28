import {BLOGGERS, BloggerType, POSTS, PostType} from "../types";
import uuid from "uuid";

export const postsRepositoryWithMock = {
    getAllPosts() {
        return POSTS
    },
    createPost(title: string, shortDescription: string, content: string, bloggerId: string) {
        const blogger = BLOGGERS.find(b => b.id === bloggerId)
        if (blogger) {
            const newPost: PostType = {
                id: uuid.v4(),
                title,
                shortDescription,
                content,
                bloggerId: blogger.id,
                bloggerName: blogger.name
            }
            POSTS.push(newPost)
            return newPost
        } else {
            throw new Error('123')
        }
    },
    getPostById(id: string) {
        const post = POSTS.find(p => p.id === id)
        return post
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const post = POSTS.find(p => p.id === id)
        if (post) {
            post.title = title,
                post.shortDescription = shortDescription,
                post.content = content,
                post.bloggerId = bloggerId
            return true
        } else {
            return false
        }
    },
    deletePost(id: string) {
        const postIndex = POSTS.findIndex(p => p.id === id)
        if (postIndex >= 0) {
            POSTS.splice(postIndex, 1)
            return true
        } else {
            return false
        }
    }
}