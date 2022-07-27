export type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}

export type PostType = {
    id: string,
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}

export type UserType = {
    id: string,
    login: string,
}

export type UserDBType = UserType & {
    passwordHash: string,
    email: string,
    confirmationCode?: string
    isActivated?: boolean
}


export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: string
}

export type SendEmailType = {
    emailTo: string,
    subject: string,
    text: string,
    html: string
}

export type CommentDBType = CommentType & {
    postId: string
}


export type ResponseType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

export type IpRequestType = {
    ip: string,
    endpoint: string
    createdAt: Date
}

export type TokenType = {
    userId: string,
    refreshToken: string
}

export const BLOGGERS: BloggerType[] = [
    {id: '0', name: 'Artem', youtubeUrl: 'https://www.youtube.com/c/satansdeer1'},
    {id: '1', name: 'Dima', youtubeUrl: 'https://www.youtube.com/c/satansdeer2'},
    {id: '2', name: 'Yan', youtubeUrl: 'https://www.youtube.com/c/satansdeer3'},
    {id: '3', name: 'Sasha', youtubeUrl: 'https://www.youtube.com/c/satansdeer4'},
]

export type ErrorsMessagesType = {
    errorsMessages: [
        {
            message: string,
            field: string,
        }

    ],
    resultCode?: number
}


export const POSTS: PostType[] = [
    {
        id: '0',
        title: 'testTitle0',
        bloggerId: '0',
        bloggerName: 'Artem',
        content: 'Test Content0',
        shortDescription: 'Test Description0'
    },
    {
        id: '1',
        title: 'testTitle1',
        bloggerId: '1',
        bloggerName: 'Dima',
        content: 'Test Content1',
        shortDescription: 'Test Description1'
    },
    {
        id: '2',
        title: 'testTitle2',
        bloggerId: '2',
        bloggerName: 'Yan',
        content: 'Test Content2',
        shortDescription: 'Test Description2'
    },
    {
        id: '3',
        title: 'testTitle3',
        bloggerId: '3',
        bloggerName: 'Sasha',
        content: 'Test Content3',
        shortDescription: 'Test Description3'
    },

]