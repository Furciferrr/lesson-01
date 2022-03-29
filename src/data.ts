import { Blogger, Post } from "./types";

export let bloggers: Array<Blogger> = [
  {
    id: 1,
    name: "Dimych",
    youtubeUrl: "it-kamasutra",
    posts: [
      {
        id: 1,
        title: "Hello all",
        shortDescription: "short description",
        content: "post content",
        bloggerId: 1,
        blog: {
          id: 1,
          name: "Dimych",
          youtubeUrl: "it-kamasutra",
          posts: ["Hello all"],
        },
      },
    ],
  },
];

export let posts: Array<Post> = [
  {
    id: 1,
    title: "Hello all",
    shortDescription: "short description",
    content: "post content",
    bloggerId: 1,
    blog: {
      id: 1,
      name: "Dimych",
      youtubeUrl: "it-kamasutra",
      posts: ["Hello all"],
    },
  },
];
