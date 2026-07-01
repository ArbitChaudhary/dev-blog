export const mockUser = {
  name: "Jane Doe",
  username: "janedoe",
  avatarUrl: "https://i.pravatar.cc/150?u=janedoe",
  bio: "Full-stack developer passing time building cool stuff. Open source enthusiast.",
  website: "https://janedoe.dev",
  location: "San Francisco, CA",
  github: "janedoe",
  twitter: "janedoe",
  linkedin: "janedoe",
  joinDate: "January 2023",
};

export const mockStats = {
  publishedPosts: 42,
  drafts: 3,
  totalViews: 152000,
  totalLikes: 8400,
  totalComments: 312,
  bookmarksReceived: 1050,
};

export const mockPosts = [
  {
    id: "1",
    title: "Mastering React Server Components",
    excerpt:
      "Learn how to leverage React Server Components to build faster, more dynamic applications in Next.js 15.",
    coverImage: "https://picsum.photos/seed/react/600/400",
    category: "React",
    publishDate: "Oct 12, 2023",
    readingTime: "8 min read",
    views: 12500,
    likes: 852,
    comments: 45,
    bookmarks: 120,
  },
  {
    id: "2",
    title: "The Ultimate Guide to Tailwind CSS",
    excerpt:
      "Discover advanced techniques for creating responsive, maintainable designs with Tailwind CSS.",
    coverImage: "https://picsum.photos/seed/tailwind/600/400",
    category: "CSS",
    publishDate: "Sep 28, 2023",
    readingTime: "12 min read",
    views: 8900,
    likes: 620,
    comments: 32,
    bookmarks: 85,
  },
  {
    id: "3",
    title: "Building APIs with tRPC",
    excerpt:
      "End-to-end typesafe APIs made easy. See how tRPC can speed up your development workflow.",
    coverImage: "https://picsum.photos/seed/trpc/600/400",
    category: "TypeScript",
    publishDate: "Aug 15, 2023",
    readingTime: "6 min read",
    views: 5400,
    likes: 410,
    comments: 18,
    bookmarks: 42,
  },
];

export const mockDrafts = [
  {
    id: "4",
    title: "Next.js App Router Insights",
    lastEdited: "10 hours ago",
  },
  {
    id: "5",
    title: "State Management in 2024",
    lastEdited: "2 days ago",
  },
];

export const mockBookmarks = [
  {
    id: "6",
    title: "Understanding Server Actions",
    author: "John Smith",
    coverImage: "https://picsum.photos/seed/server/600/400",
    category: "Next.js",
    readingTime: "5 min read",
    bookmarkedDate: "Oct 18, 2023",
  },
  {
    id: "7",
    title: "CSS variables for dynamic themes",
    author: "Alice Johnson",
    coverImage: "https://picsum.photos/seed/cssvars/600/400",
    category: "Design",
    readingTime: "7 min read",
    bookmarkedDate: "Oct 15, 2023",
  },
];

export const mockComments = [
  {
    id: "c1",
    blogTitle: "Next.js App Router Insights",
    blogId: "4",
    preview:
      "Great article! This really helped me understand layout components better.",
    date: "Oct 20, 2023",
  },
  {
    id: "c2",
    blogTitle: "Building APIs with tRPC",
    blogId: "3",
    preview: "I tried this but ran into a CORS issue. Any tips?",
    date: "Sep 01, 2023",
  },
];

export const mockActivity = [
  {
    id: "a1",
    type: "published",
    target: "Mastering React Server Components",
    date: "Oct 12, 2023",
  },
  {
    id: "a2",
    type: "commented",
    target: "Understanding Server Actions",
    date: "Oct 10, 2023",
  },
  {
    id: "a3",
    type: "bookmarked",
    target: "CSS variables for dynamic themes",
    date: "Oct 05, 2023",
  },
  {
    id: "a4",
    type: "updated",
    target: "The Ultimate Guide to Tailwind CSS",
    date: "Oct 01, 2023",
  },
];
