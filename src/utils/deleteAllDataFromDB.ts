import {User} from "../entities/users/model";
import {Blogger} from "../entities/bloggers/model";
import {Post} from "../entities/posts/model";
import {Comment} from "../entities/comments/model";

export const deleteAllDataFromDB = async () => {
    await User.deleteMany({})
    await Blogger.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
}