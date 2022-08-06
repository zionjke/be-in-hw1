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
