import { IsNotEmpty, Matches, IsOptional, MaxLength } from "class-validator";
export class BloggerDto {
  @IsNotEmpty({ message: "name field is required" })
  @MaxLength(15)
  readonly name: string;
  @IsNotEmpty({ message: "youtubeUrl is field required" })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/gm), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class UpdateBloggerDto {
  @IsNotEmpty({ message: "should be not empty" })
  @MaxLength(15)
  readonly name: string;
  @IsOptional()
  @IsNotEmpty({ message: "youtubeUrl should be not empty" })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/gm), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class PostDto {
  @IsNotEmpty({ message: "title field is required" })
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  @MaxLength(1000)
  readonly content: string;
  @IsNotEmpty({ message: "bloggerId field is required" })
  readonly bloggerId: number;
}

export class PostDtoWithoutBlogger {
  @IsNotEmpty({ message: "title field is required" })
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  @MaxLength(1000)
  readonly content: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  readonly title: string;
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  readonly shortDescription: string;
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(1000)
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
