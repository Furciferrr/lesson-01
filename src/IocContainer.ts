import { AuthController } from "./controllers/auth";
import { UserService } from "./services/users-service";
import { CommentsController } from "./controllers/comments";
import { BloggerController } from "./controllers/bloggers";
import { BloggerRepository } from "./repositories/bloggers-repository";
import { Container } from "inversify";
import {
  IAuthService,
  IBloggerRepository,
  IBloggerService,
  IBodyValidator,
  ICommentsRepository,
  ICommentsService,
  IMailSender,
  IPostRepository,
  IPostService,
  IRequestAttemptsRepository,
  IUserRepository,
  IUserService,
  IVideosController,
  IVideosRepository,
} from "./interfaces";
import { VideosRepository } from "./repositories/videos-repository";
import { BodyValidator } from "./validator";
import { BloggerService } from "./services/bloggers-service";
import { PostRepository } from "./repositories/posts-repository";
import { PostService } from "./services/posts-service";
import { PostController } from "./controllers/posts";
import { CommentsRepository } from "./repositories/comments-repository";
import { CommentsService } from "./services/comments-service";
import { UserRepository } from "./repositories/users-repository";
import { UserController } from "./controllers/users";
import { VideosController } from "./controllers/videos";
import { TYPES } from "./IocTypes";
import { MailSender } from "./adapters/email-adapter";
import { AuthService } from "./services/auth-service";
import { RequestAttemptsRepository } from "./repositories/requestsAttempts-repository";



const myContainer = new Container();
myContainer.bind<IBodyValidator>(TYPES.BodyValidator).to(BodyValidator);

myContainer
  .bind<IVideosRepository>(TYPES.VideosRepository)
  .to(VideosRepository);
myContainer.bind<IVideosController>(TYPES.VideosController).to(VideosController);

myContainer
  .bind<IBloggerRepository>(TYPES.BloggerRepository)
  .to(BloggerRepository);
myContainer.bind<IBloggerService>(TYPES.BloggerService).to(BloggerService);
myContainer
  .bind<BloggerController>(TYPES.BloggerController)
  .to(BloggerController);

myContainer.bind<IPostRepository>(TYPES.PostRepository).to(PostRepository);
myContainer.bind<IPostService>(TYPES.PostService).to(PostService);
myContainer.bind<PostController>(TYPES.PostController).to(PostController);

myContainer
  .bind<ICommentsRepository>(TYPES.CommentRepository)
  .to(CommentsRepository);
myContainer.bind<ICommentsService>(TYPES.CommentService).to(CommentsService);
myContainer
  .bind<CommentsController>(TYPES.CommentController)
  .to(CommentsController);

myContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
myContainer.bind<IUserService>(TYPES.UserService).to(UserService);
myContainer.bind<UserController>(TYPES.UserController).to(UserController);

myContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
myContainer.bind<IAuthService>(TYPES.AuthService).to(AuthService);

myContainer.bind<IMailSender>(TYPES.EmailAdapter).to(MailSender);

myContainer.bind<IRequestAttemptsRepository>(TYPES.RequestAttemptRepository).to(RequestAttemptsRepository);

export { myContainer as ioc };
