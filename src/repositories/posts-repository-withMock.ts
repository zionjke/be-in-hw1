import {BLOGGERS, BloggerType, POSTS, PostType} from "../types";

export const postsRepositoryWithMock = {
    getAllPosts() {
        return POSTS
    },
    createPost(title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = BLOGGERS.find(b => b.id === bloggerId)
        if (blogger) {
            const newPost: PostType = {
                id: +(new Date()),
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
    getPostById(id: number) {
        const post = POSTS.find(p => p.id === id)
        return post
    },
    updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number) {
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
    deletePost(id: number) {
        const postIndex = POSTS.findIndex(p => p.id === +id)
        if (postIndex >= 0) {
            POSTS.splice(postIndex, 1)
            return true
        } else {
            return false
        }
    }
}