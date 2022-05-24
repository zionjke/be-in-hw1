import {BLOGGERS, BloggerType} from "../constants";

export const bloggersRepositoryWithMock = {
    geBloggers() {
        return BLOGGERS
    },
    getBloggerById(id: number) {
        const blogger = BLOGGERS.find(b => b.id === id)
        return blogger
    },
    createNewBlogger(name: string, youtubeUrl: string) {
        const newBlogger: BloggerType = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        BLOGGERS.push(newBlogger)
        return newBlogger
    },
    updateBlogger(id: number, name: string, youtubeUrl: string) {
        const blogger = BLOGGERS.find(b => b.id === id)
        if (blogger) {
            blogger.name = name,
                blogger.youtubeUrl = youtubeUrl
            return true
        } else {
            return false
        }
    },
    deleteBlogger(id: number) {
        const bloggerIndex = BLOGGERS.findIndex(b => b.id === id)
        if (bloggerIndex >= 0) {
            BLOGGERS.splice(bloggerIndex, 1)
            return true
        } else {
            return false
        }
    }
}