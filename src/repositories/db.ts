import { Blogger, Post } from "../types";

export const videos = [
  { id: 1, title: "About JS - 01", author: "it-incubator.eu" },
  { id: 2, title: "About JS - 02", author: "it-incubator.eu" },
  { id: 3, title: "About JS - 03", author: "it-incubator.eu" },
  { id: 4, title: "About JS - 04", author: "it-incubator.eu" },
  { id: 5, title: "About JS - 05", author: "it-incubator.eu" },
];

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
	  bloggerName: 'Dimych',
	},
  ];
