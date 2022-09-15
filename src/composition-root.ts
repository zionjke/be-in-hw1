import {BloggersRepository} from "./entities/bloggers/bloggers-repository";
import {BloggersService} from "./entities/bloggers/bloggers-service";
import {BloggersController} from "./entities/bloggers/bloggers-controller";
import {PostsRepository} from "./entities/posts/posts-repository";
import {PostsService} from "./entities/posts/posts-service";
import {PostsController} from "./entities/posts/posts-controller";
import {CommentsRepository} from "./entities/comments/comments-repository";
import {CommentsService} from "./entities/comments/comments-service";
import {CommentsController} from "./entities/comments/comments-controller";
import {UsersRepository} from "./entities/users/users-repository";
import {UsersService} from "./entities/users/users-service";
import {UsersController} from "./entities/users/users-contoller";
import {AuthService} from "./entities/auth/auth-service";
import {AuthController} from "./entities/auth/auth-controller";
import {JwtService} from "./application/jwt-service";
import {MailService} from "./application/mail-service";
import {TokensRepository} from "./entities/tokens/tokens-repository";

export const tokensRepository = new TokensRepository()
export const jwtService = new JwtService(tokensRepository)
export const mailService = new MailService()

const bloggersRepository = new BloggersRepository()
const bloggersService = new BloggersService(bloggersRepository)
export const bloggersController = new BloggersController(bloggersService)

const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository, bloggersService )
export const postsController = new PostsController(postsService)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository, postsService )
export const commentsController = new CommentsController(commentsService)


const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository)
export const usersController = new UsersController(usersService)

const authService = new AuthService(usersService, jwtService, mailService)
export const authController = new AuthController(authService)
