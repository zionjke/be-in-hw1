export const pagination = (pageNumber: number  | undefined, _pageSize: number | undefined, totalCount: number) => {
    const page = pageNumber || 1

    const pageSize = _pageSize || 10

    const startFrom = (page - 1) * pageSize

    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
        page,
        pageSize,
        startFrom,
        pagesCount
    }
}