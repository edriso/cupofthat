const DAY = 86400 * 1000

function daysAgo(n) {
  return new Date(Date.now() - DAY * n).toISOString()
}

function dateOnly(n) {
  return new Date(Date.now() - DAY * n).toISOString().slice(0, 10)
}

export const MOCK_TOKEN = "mock-jwt-token-cupofthat"

export const MOCK_USER = {
  id: 1,
  firstname: "Jane",
  lastname: "Doe",
  username: "janedoe",
  craft: "Designer",
  bio: "Coffee enthusiast & creative thinker.",
  email: "jane@example.com",
  birthday: "1995-06-15",
  password: "",
  images: [
    { type: "user_profiles", image: "https://i.pravatar.cc/200?u=janedoe" },
    { type: "user_covers", image: "https://picsum.photos/seed/cover1/1200/400" },
  ],
  postsCount: 5,
  blocklist: [],
  calendar_start: 1,
  calendar_display: "month",
  is_verified: true,
  last_post_date: daysAgo(1),
  socials: { website: "" },
}

export const MOCK_OTHER_USER = {
  id: 2,
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  craft: "Developer",
  bio: "Building things one cup at a time.",
  email: "john@example.com",
  birthday: "1992-03-20",
  password: "",
  images: [
    { type: "user_profiles", image: "https://i.pravatar.cc/200?u=johndoe" },
    { type: "user_covers", image: "https://picsum.photos/seed/cover2/1200/400" },
  ],
  postsCount: 3,
  blocklist: [],
  calendar_start: 1,
  calendar_display: "month",
  is_verified: true,
  last_post_date: daysAgo(0),
  socials: { website: "" },
}

export const MOCK_POSTS = [
  {
    id: 1,
    content: "Just had the best cup of pour-over this morning. Notes of blueberry and dark chocolate.",
    tag: "coffee",
    image: "https://picsum.photos/seed/post1/600/400",
    newImage: null,
    owner: MOCK_USER,
    created_at: daysAgo(1),
    liked: false,
    likesCount: 12,
  },
  {
    id: 2,
    content: "Sketching out a new logo concept. Sometimes the simplest ideas take the longest.",
    tag: "design",
    image: "https://picsum.photos/seed/post2/600/400",
    newImage: null,
    owner: MOCK_OTHER_USER,
    created_at: daysAgo(0),
    liked: true,
    likesCount: 8,
  },
  {
    id: 3,
    content: "Morning run done. 5K in 24 minutes. Feeling grateful for the energy today.",
    tag: "fitness",
    image: null,
    newImage: null,
    owner: MOCK_USER,
    created_at: daysAgo(2),
    liked: false,
    likesCount: 5,
  },
]

export const MOCK_CALENDAR = [
  { date: dateOnly(0), count: 1, post: MOCK_POSTS[1] },
  { date: dateOnly(1), count: 1, post: MOCK_POSTS[0] },
  { date: dateOnly(2), count: 1, post: MOCK_POSTS[2] },
  {
    date: dateOnly(4),
    count: 1,
    post: { id: 4, content: "Read a chapter of a great book today.", tag: "reading", image: null, owner: MOCK_USER, created_at: daysAgo(4), liked: false, likesCount: 2 },
  },
  {
    date: dateOnly(6),
    count: 1,
    post: { id: 5, content: "Practiced guitar for 15 minutes.", tag: "music", image: null, owner: MOCK_USER, created_at: daysAgo(6), liked: true, likesCount: 4 },
  },
  {
    date: dateOnly(9),
    count: 1,
    post: { id: 6, content: "Wrote a short journal entry this morning.", tag: "writing", image: null, owner: MOCK_USER, created_at: daysAgo(9), liked: false, likesCount: 1 },
  },
  {
    date: dateOnly(12),
    count: 1,
    post: { id: 7, content: "Tried a new recipe. Turned out amazing!", tag: "cooking", image: null, owner: MOCK_USER, created_at: daysAgo(12), liked: true, likesCount: 7 },
  },
  {
    date: dateOnly(15),
    count: 1,
    post: { id: 8, content: "Deep work session on the side project.", tag: "coding", image: null, owner: MOCK_USER, created_at: daysAgo(15), liked: false, likesCount: 3 },
  },
]

