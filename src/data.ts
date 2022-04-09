import { Blogger, Post } from "./types";

export let bloggers: Array<Blogger> = [
  {
    id: 1,
    name: "Dimych",
    youtubeUrl: "https://it-kamasutra.com",
  },
];

export let posts: Array<Post> = [
  {
    id: 1,
    title: "Hello all",
    shortDescription: "short description",
    content: "post content",
    bloggerId: 1,
  },
];
