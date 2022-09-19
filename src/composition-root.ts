import 'reflect-metadata'
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
import {TokensService} from "./entities/tokens/tokens-service";
import {Container} from "inversify";

export const container = new Container()

container.bind<BloggersRepository>(BloggersRepository).to(BloggersRepository)
container.bind<BloggersService>(BloggersService).to(BloggersService)
container.bind<BloggersController>(BloggersController).to(BloggersController)

container.bind<PostsRepository>(PostsRepository).to(PostsRepository)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostsController>(PostsController).to(PostsController)

container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<CommentsController>(CommentsController).to(CommentsController)

container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<UsersController>(UsersController).to(UsersController)

container.bind<AuthService>(AuthService).to(AuthService)
container.bind<AuthController>(AuthController).to(AuthController)

container.bind<TokensService>(TokensService).to(TokensService)

container.bind<JwtService>(JwtService).to(JwtService)

container.bind<MailService>(MailService).to(MailService)

// const tokensService = new TokensService()
// export const jwtService = new JwtService(tokensService)
// const mailService = new MailService()

// const bloggersRepository = new BloggersRepository()
// const bloggersService = new BloggersService(bloggersRepository)
// export const bloggersController = new BloggersController(bloggersService)

// const postsRepository = new PostsRepository()
// const postsService = new PostsService(postsRepository, bloggersService )
// export const postsController = new PostsController(postsService)

// const commentsRepository = new CommentsRepository()
// const commentsService = new CommentsService(commentsRepository, postsService )
// export const commentsController = new CommentsController(commentsService)

// const usersRepository = new UsersRepository()
// export const usersService = new UsersService(usersRepository)
// export const usersController = new UsersController(usersService)

// const authService = new AuthService(usersService, jwtService, mailService)
// export const authController = new AuthController(authService)


