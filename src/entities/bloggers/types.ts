import {ResponseType} from "../../types";

export class BloggerType {
    id: string
    name: string
    youtubeUrl: string

    constructor(id: string, name: string, youtubeUrl: string) {
        this.id = id;
        this.name = name;
        this.youtubeUrl = youtubeUrl;
    }
}

export type BloggersResponseType = ResponseType<BloggerType[]>
