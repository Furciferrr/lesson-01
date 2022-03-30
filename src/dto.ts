import { IsNotEmpty, Matches } from "class-validator";
export class BloggerDto {
  @IsNotEmpty({message: 'name field required'})
  readonly name: string;
  @IsNotEmpty({message: 'youtubeUrl field required'})
  @Matches(RegExp(/^http(s)?:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]+/gm), {message: 'URL Not Valid'})
  readonly youtubeUrl: string;
}
