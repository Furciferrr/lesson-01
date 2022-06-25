import { Request, Response } from "express";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { BloggerDto, CommentDto, PostDto, UpdatePostDto, UserDto } from "./dto";
import {
  Blogger,
  CommentDBType,
  CommentResponse,
  DBType,
  Post,
  RequestAttemptType,
  ResponseType,
  UserDBType,
  UserViewType,
  VideoType,
} from "./types";
import { getRandomNumber } from "./utils";
import { ValidationResult } from "./validator";

export interface IBodyValidator {
  validateAndConvert(classToConvert: any, body: {}): Promise<ValidationResult>;
}

export interface IVideosRepository {
  getVideos(): Promise<VideoType[]>;
  getVideoById(id: number): Promise<VideoType | null>;
  deleteVideoById(id: number): Promise<boolean>;
  updateVideoById(id: number, title: string): Promise<boolean>;
  createVideo(title: string): Promise<VideoType>;
}

export interface IVideosController {
  getVideos(req: Request, res: Response): any;

  updateVideoById(req: Request, res: Response): any;

  deleteVideoById(req: Request, res: Response): any;
  createVideo(req: Request, res: Response): any;

  getVideoById(req: Request, res: Response): any;
}

export interface IUserRepository {
  getUsers(pageNumber: number, pageSize: number): Promise<UserViewType[]>;
  getTotalCount(): Promise<number>;
  getUserByLogin(login: string): Promise<UserDBType | null>;
  getUserById(id: string): Promise<UserDBType | null>;
  getUserByLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserDBType | null>;
  getUserByConfirmationCode(
    confirmationCode: string
  ): Promise<UserDBType | null>;
  updateUserById(user: Partial<UserDBType> & { id: string }): Promise<boolean>;
  deleteUserById(id: string): Promise<boolean>;
  createUser(user: UserDBType): Promise<UserViewType>;
}

export interface IUserService {
  getUsers(
    pageNumber?: number,
    pageSize?: number
  ): Promise<ResponseType<UserViewType>>;
  deleteUserById(id: string): Promise<boolean>;
  getUserById(id: string): Promise<UserViewType | null>;
  createUser(user: UserDto): Promise<UserViewType | null>;
  getUserByLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserViewType | null>;
  confirmEmail(code: string): Promise<boolean>;
  checkCredentials(
    login: string,
    password: string
  ): Promise<{ resultCode: number; data: { token?: string | null } }>;
}

export interface IAuthService {
  createUser(user: UserDto): Promise<UserViewType | null>;
}

export interface IBloggerRepository {
  getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string
  ): Promise<Array<Blogger>>;
  getTotalCount(searchTerm?: string): Promise<number>;

  getBloggerById(id: string): Promise<Blogger | null>;
  deleteBloggerById(id: string): Promise<boolean>;
  updateBloggerById(id: string, dto: BloggerDto): Promise<boolean>;
  createBlogger(blogger: Blogger): Promise<Blogger>;
}

export interface IBloggerService {
  getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string
  ): Promise<ResponseType<Blogger>>;
  getBloggerById(id: string): Promise<Blogger | null>;
  deleteBloggerById(id: string): Promise<boolean>;
  updateBloggerById(id: string, dto: BloggerDto): Promise<boolean>;
  createBlogger(blogger: BloggerDto): Promise<Blogger>;
}

export interface IPostRepository {
  getPosts(pageNumber: number, pageSize: number): Promise<Post[]>;
  getTotalCount(): Promise<number>;
  getPostById(id: string): Promise<Post | null>;
  deletePostById(id: string): Promise<boolean>;
  deletePostsByBloggerId(id: string): Promise<boolean>;
  updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean>;
  createPost(post: Post): Promise<Post>;
  getPostByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number
  ): Promise<DBType<Post>>;
}

export interface IPostService {
  getPosts(pageNumber: number, pageSize: number): Promise<ResponseType<Post>>;
  getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number
  ): Promise<ResponseType<Post> | false>;
  getPostById(id: string): Promise<Post | null>;
  deletePostById(id: string): Promise<boolean>;
  updatePostById(id: string, postDto: UpdatePostDto): Promise<400 | 404 | 204>;
  createPost(postDto: PostDto): Promise<Post | false>;
}

export interface ICommentsService {
  getCommentById(id: string): Promise<CommentDBType | null>;
  updateCommentById(id: string, commentDto: CommentDto): Promise<boolean>;
  deleteCommentById(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number
  ): Promise<ResponseType<CommentResponse>>;
  createComment(
    postId: string,
    commentDto: CommentDto,
    user: UserViewType
  ): Promise<CommentDBType>;
}

export interface ICommentsRepository {
  getCommentById(id: string): Promise<CommentDBType | null>;
  updateCommentById(id: string, commentDto: CommentDto): Promise<boolean>;
  deleteCommentById(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number
  ): Promise<Array<CommentResponse>>;
  createComment(comment: CommentDBType): Promise<CommentDBType>;
  getTotalCount(postId: string): Promise<number>;
}

export interface IMailSender {
  sendEmail(
    address: string,
    body: string
  ): Promise<SMTPTransport.SentMessageInfo | undefined>;
}

export interface IRequestAttemptsRepository {
  getRequestAttemptsBetweenToDates(
    ip: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<RequestAttemptType>>;
  createRequestAttempt(requestAttempt: RequestAttemptType): Promise<boolean>;
}
