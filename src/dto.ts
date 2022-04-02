import { IsNotEmpty, Matches, IsOptional } from "class-validator";
export class BloggerDto {
  @IsNotEmpty({ message: "name field is required" })
  readonly name: string;
  @IsNotEmpty({ message: "youtubeUrl is field required" })
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]+/gm), {
    message: "URL Not Valid",
  })
  readonly youtubeUrl: string;
}

export class PostDto {
  @IsNotEmpty({ message: "title field is required" })
  readonly title: string;
  @IsNotEmpty({ message: "shortDescription field is required" })
  readonly shortDescription: string;
  @IsNotEmpty({ message: "content field is required" })
  readonly content: string;
  @IsNotEmpty({ message: "bloggerId field is required" })
  readonly bloggerId: number;
}

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  readonly title: string;
  @IsOptional()
  @IsNotEmpty()
  readonly shortDescription: string;
  @IsOptional()
  @IsNotEmpty()
  readonly content: string;
}
