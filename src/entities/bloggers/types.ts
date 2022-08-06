import {ResponseType} from "../../types";

export type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}

export type BloggersResponseType = ResponseType<BloggerType[]>