export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export type PostType = {
    id: number,
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}


export type ResponseType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

export const BLOGGERS: BloggerType[] = [
    {id: 0, name: 'Artem', youtubeUrl: 'https://www.youtube.com/c/satansdeer1'},
    {id: 1, name: 'Dima', youtubeUrl: 'https://www.youtube.com/c/satansdeer2'},
    {id: 2, name: 'Yan', youtubeUrl: 'https://www.youtube.com/c/satansdeer3'},
    {id: 3, name: 'Sasha', youtubeUrl: 'https://www.youtube.com/c/satansdeer4'},
]

export const POSTS: PostType[] = [
    {
        id: 0,
        title: 'testTitle0',
        bloggerId: 0,
        bloggerName: 'Artem',
        content: 'Test Content0',
        shortDescription: 'Test Description0'
    },
    {
        id: 1,
        title: 'testTitle1',
        bloggerId: 1,
        bloggerName: 'Dima',
        content: 'Test Content1',
        shortDescription: 'Test Description1'
    },
    {
        id: 2,
        title: 'testTitle2',
        bloggerId: 2,
        bloggerName: 'Yan',
        content: 'Test Content2',
        shortDescription: 'Test Description2'
    },
    {
        id: 3,
        title: 'testTitle3',
        bloggerId: 3,
        bloggerName: 'Sasha',
        content: 'Test Content3',
        shortDescription: 'Test Description3'
    },

]