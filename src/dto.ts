import { IsNotEmpty, Matches, IsOptional, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "./utils";
export class BloggerDto {
  @IsNotEmpty({ message: "name field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(15)
  readonly name: string;
  @IsNotEmpty({ message: "youtubeUrl is field required" })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/m), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class UpdateBloggerDto {
  @IsNotEmpty({ message: "should be not empty" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(15)
  readonly name: string;
  @IsOptional()
  @IsNotEmpty({ message: "youtubeUrl should be not empty" })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/m), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class PostDto {
  @IsNotEmpty({ message: "title field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  @MinLength(1)
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotBlank('', {message: 'should be not blank'})
  @IsNotEmpty({ message: "content field is required" })
  @MinLength(1)
  @MaxLength(1000)
  readonly content: string;
  @IsNotEmpty({ message: "bloggerId field is required" })
  readonly bloggerId: string;
}

export class PostDtoWithoutBlogger {
  @IsNotEmpty({ message: "title field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(1000)
  readonly content: string;
}

export class UpdatePostDto {
  @IsNotEmpty()
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotBlank('', {message: 'should be not blank'})
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  readonly content: string;
  @IsOptional()
  @IsNotEmpty()
  readonly bloggerId: string;
}

export class VideoDto {
  @IsNotEmpty({ message: "title field is required" })
  readonly title: string;
}

export class UserDto {
  @IsNotEmpty({ message: "username field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  readonly login: string;
  @IsNotEmpty({ message: "password field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(1)
  readonly password: string;
}

export class CommentDto {
  @IsNotEmpty({ message: "content field is required" })
  @IsNotBlank('', {message: 'should be not blank'})
  @MinLength(20)
  @MaxLength(300)
  readonly content: string;
}
