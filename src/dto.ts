import { IsNotEmpty, Matches, IsOptional, Max } from "class-validator";
export class BloggerDto {
  @IsNotEmpty({ message: "name field is required" })
  readonly name: string;
  @IsNotEmpty({ message: "youtubeUrl is field required" })
  @Max(20)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/gm), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class UpdateBloggerDto {
  @IsNotEmpty({ message: "should be not empty" })
  readonly name: string;
  @IsOptional()
  @IsNotEmpty({ message: "youtubeUrl should be not empty" })
  @Max(20)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/gm), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class PostDto {
  @IsNotEmpty({ message: "title field is required" })
  @Max(20)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  readonly content: string;
  @IsNotEmpty({ message: "bloggerId field is required" })
  readonly bloggerId: number;
}

export class PostDtoWithoutBlogger {
  @IsNotEmpty({ message: "title field is required" })
  @Max(20)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  readonly content: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @Max(20)
  readonly title: string;
  @IsOptional()
  @IsNotEmpty()
  readonly shortDescription: string;
  @IsOptional()
  @IsNotEmpty()
  readonly content: string;
  @IsOptional()
  @IsNotEmpty()
  readonly bloggerId: number;
}

export class VideoDto {
  @IsNotEmpty({ message: "title field is required" })
  readonly title: string;
}

export class UserDto {
  @IsNotEmpty({ message: "username field is required" })
  readonly username: string;
  @IsNotEmpty({ message: "password field is required" })
  readonly password: string;
}

export class CommentDto {
  @IsNotEmpty({ message: "content field is required" })
  readonly content: string;
}
