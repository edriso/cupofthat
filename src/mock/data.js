export const MOCK_TOKEN = "mock-jwt-token-cupofthat";

export const MOCK_USER = {
  id: 1,
  firstname: "Jane",
  lastname: "Doe",
  username: "janedoe",
  craft: "Designer",
  about: "Coffee enthusiast & creative thinker.",
  email: "jane@example.com",
  birthday: "1995-06-15",
  password: "",
  images: [
    { type: "user_profiles", image: "https://i.pravatar.cc/200?u=janedoe" },
    { type: "user_covers", image: "https://picsum.photos/seed/cover1/1200/400" }
  ],
  postsCount: 5,
  activeDays: 42,
  followers: [{ id: 2, username: "johndoe" }],
  following: [{ id: 2, username: "johndoe" }],
  blocklist: [],
  calendar_start: 1,
  is_verified: true,
  last_post_date: "",
  socials: {
    facebook: "",
    twitter: "",
    linkedin: "",
    website: ""
  }
};

export const MOCK_OTHER_USER = {
  id: 2,
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  craft: "Developer",
  about: "Building things one cup at a time.",
  email: "john@example.com",
  birthday: "1992-03-20",
  password: "",
  images: [
    { type: "user_profiles", image: "https://i.pravatar.cc/200?u=johndoe" },
    { type: "user_covers", image: "https://picsum.photos/seed/cover2/1200/400" }
  ],
  postsCount: 3,
  activeDays: 28,
  followers: [{ id: 1, username: "janedoe" }],
  following: [{ id: 1, username: "janedoe" }],
  blocklist: [],
  calendar_start: 1,
  is_verified: true,
  last_post_date: "",
  socials: {
    facebook: "",
    twitter: "",
    linkedin: "",
    website: ""
  }
};

export const MOCK_POSTS = [
  {
    id: 1,
    content: "Just had the best cup of pour-over this morning. Notes of blueberry and dark chocolate.",
    tags: "coffee",
    tag: "coffee",
    image: "https://picsum.photos/seed/post1/600/400",
    newImage: null,
    owner: MOCK_USER,
    created_at: new Date(Date.now() - 86400 * 2000).toISOString(),
    liked: false,
    likesCount: 12
  },
  {
    id: 2,
    content: "Sketching out a new logo concept. Sometimes the simplest ideas take the longest.",
    tags: "design",
    tag: "design",
    image: "https://picsum.photos/seed/post2/600/400",
    newImage: null,
    owner: MOCK_OTHER_USER,
    created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
    liked: true,
    likesCount: 8
  },
  {
    id: 3,
    content: "Morning run done. 5K in 24 minutes. Feeling grateful for the energy today.",
    tags: "fitness",
    tag: "fitness",
    image: null,
    newImage: null,
    owner: MOCK_USER,
    created_at: new Date(Date.now() - 86400 * 1000).toISOString(),
    liked: false,
    likesCount: 5
  }
];

export const MOCK_CALENDAR = [
  {
    date: new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10),
    count: 2,
    post: MOCK_POSTS[2]
  },
  {
    date: new Date(Date.now() - 86400 * 2000).toISOString().slice(0, 10),
    count: 1,
    post: MOCK_POSTS[0]
  },
  {
    date: new Date(Date.now() - 86400 * 4000).toISOString().slice(0, 10),
    count: 1,
    post: { id: 4, content: "Read a chapter of a great book today.", tags: "reading", tag: "reading", image: null, newImage: null, owner: MOCK_USER, created_at: new Date(Date.now() - 86400 * 4000).toISOString(), liked: false, likesCount: 2 }
  },
  {
    date: new Date(Date.now() - 86400 * 7000).toISOString().slice(0, 10),
    count: 3,
    post: { id: 5, content: "Practiced guitar for 15 minutes.", tags: "music", tag: "music", image: null, newImage: null, owner: MOCK_USER, created_at: new Date(Date.now() - 86400 * 7000).toISOString(), liked: true, likesCount: 4 }
  },
  {
    date: new Date(Date.now() - 86400 * 10000).toISOString().slice(0, 10),
    count: 1,
    post: { id: 6, content: "Wrote a short journal entry this morning.", tags: "writing", tag: "writing", image: null, newImage: null, owner: MOCK_USER, created_at: new Date(Date.now() - 86400 * 10000).toISOString(), liked: false, likesCount: 1 }
  }
];

export const MOCK_BADGE = {
  name: "Early Adopter",
  description: "One of the first members of the community",
  icon: "star"
};
