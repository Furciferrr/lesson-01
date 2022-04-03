export interface Blogger<T = Post> {
  id: number;
  name: string;
  youtubeUrl: string;
}

export interface Post {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
}

enum Errors {
  noContent = 204,
  notFound = 404,
  badRequest = 400,
}

export interface BloggerBodyType {
  name: string;
  youtubeUrl: string;
}

export interface ErrorType {
  data: {};
  errorsMessages: 
    {
      message: string;
      field: string;
    }[]
  ;
  resultCode: 0 | 1 | 2;
}
