import {usePagination} from "../../utils/usePagination";
import {BloggersResponseType, BloggerType} from "./types";
import {Blogger} from "./model";

export class BloggersRepository  {
    async getBloggers(searchNameTerm?: string, pageNumber?: number, _pageSize?: number): Promise<BloggersResponseType> {

        const filter: any = {}

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm}
        }

        const totalCount = await Blogger.countDocuments(filter)

        const {page, pageSize, startFrom, pagesCount} = usePagination(pageNumber, _pageSize, totalCount)

        const bloggers = await Blogger
            .find(filter, {_id: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        }
    }

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {

        const blogger = new Blogger(newBlogger)

        await blogger.save()

        return newBlogger
    }

    async getBloggerById(id: string): Promise<BloggerType | null> {
        const blogger: BloggerType | null = await Blogger.findOne({id}, {_id: false})

        return blogger
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await Blogger.updateOne(
            {id},
            {name, youtubeUrl}
        )

        return result.matchedCount !== 0;
    }

    async deleteBlogger(id: string): Promise<boolean> {
        const result = await Blogger.deleteOne({id})

        return result.deletedCount !== 0;
    }
}

