export interface HomePost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
  readingTime: string;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  bookmarkCount: number;
  featured: boolean;
}

export const featuredPosts: HomePost[] = [
  {
    id: "f1",
    title: "Building Production-Grade Apps with React Server Components",
    excerpt:
      "A deep dive into RSC architecture, streaming, and the mental models you need to ship fast, resilient interfaces at scale.",
    coverImage: "https://picsum.photos/seed/rsc-hero/1600/900",
    category: "React",
    author: {
      name: "Jane Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=janedoe",
    },
    publishDate: "Jun 28, 2026",
    readingTime: "10 min read",
    viewCount: 24500,
    reactionCount: 1820,
    commentCount: 96,
    bookmarkCount: 340,
    featured: true,
  },
  {
    id: "f2",
    title: "The 2026 Guide to Edge Rendering and Global Latency",
    excerpt:
      "How to design apps that feel instant everywhere — caching strategies, ISR, and the trade-offs of running at the edge.",
    coverImage: "https://picsum.photos/seed/edge-hero/1600/900",
    category: "Performance",
    author: {
      name: "Marcus Lee",
      avatarUrl: "https://i.pravatar.cc/150?u=marcuslee",
    },
    publishDate: "Jun 22, 2026",
    readingTime: "8 min read",
    viewCount: 18900,
    reactionCount: 1290,
    commentCount: 74,
    bookmarkCount: 265,
    featured: true,
  },
  {
    id: "f3",
    title: "Type-Safe Full-Stack Development from Schema to UI",
    excerpt:
      "End-to-end type safety with generated clients, validated boundaries, and zero-drift contracts between backend and frontend.",
    coverImage: "https://picsum.photos/seed/typesafe-hero/1600/900",
    category: "TypeScript",
    author: {
      name: "Priya Nair",
      avatarUrl: "https://i.pravatar.cc/150?u=priyanair",
    },
    publishDate: "Jun 15, 2026",
    readingTime: "12 min read",
    viewCount: 15400,
    reactionCount: 980,
    commentCount: 58,
    bookmarkCount: 210,
    featured: true,
  },
];

export const latestPosts: HomePost[] = [
  {
    id: "l1",
    title: "Mastering Tailwind CSS v4 Theming",
    excerpt:
      "Design tokens, oklch color spaces, and dark mode done right with the new Tailwind v4 engine.",
    coverImage: "https://picsum.photos/seed/tailwind4/800/600",
    category: "CSS",
    author: {
      name: "Alice Johnson",
      avatarUrl: "https://i.pravatar.cc/150?u=alicejohnson",
    },
    publishDate: "Jun 30, 2026",
    readingTime: "7 min read",
    viewCount: 6400,
    reactionCount: 420,
    commentCount: 28,
    bookmarkCount: 64,
    featured: false,
  },
  {
    id: "l2",
    title: "State Management Patterns You Actually Need",
    excerpt:
      "When to reach for RTK Query, server state, and local state — a practical decision framework.",
    coverImage: "https://picsum.photos/seed/state-mgmt/800/600",
    category: "Architecture",
    author: {
      name: "David Kim",
      avatarUrl: "https://i.pravatar.cc/150?u=davidkim",
    },
    publishDate: "Jun 27, 2026",
    readingTime: "9 min read",
    viewCount: 5100,
    reactionCount: 356,
    commentCount: 22,
    bookmarkCount: 51,
    featured: false,
  },
  {
    id: "l3",
    title: "Authentication with AWS Cognito and Amplify Gen 2",
    excerpt:
      "A complete walkthrough of sign-up, sign-in, and protected routes using the modern Amplify data stack.",
    coverImage: "https://picsum.photos/seed/cognito-auth/800/600",
    category: "AWS",
    author: {
      name: "Sofia Martins",
      avatarUrl: "https://i.pravatar.cc/150?u=sofiamartins",
    },
    publishDate: "Jun 24, 2026",
    readingTime: "11 min read",
    viewCount: 4300,
    reactionCount: 298,
    commentCount: 19,
    bookmarkCount: 47,
    featured: false,
  },
  {
    id: "l4",
    title: "Writing Accessible Components from Day One",
    excerpt:
      "Keyboard navigation, ARIA semantics, and reduced-motion patterns that scale across a design system.",
    coverImage: "https://picsum.photos/seed/a11y/800/600",
    category: "Accessibility",
    author: {
      name: "Tom Becker",
      avatarUrl: "https://i.pravatar.cc/150?u=tombecker",
    },
    publishDate: "Jun 20, 2026",
    readingTime: "6 min read",
    viewCount: 3900,
    reactionCount: 275,
    commentCount: 16,
    bookmarkCount: 38,
    featured: false,
  },
];

export const trendingPosts: HomePost[] = [
  {
    id: "t1",
    title: "Why Server Actions Change How We Build Forms",
    excerpt:
      "Progressive enhancement, mutations, and less client JavaScript with the App Router.",
    coverImage: "https://picsum.photos/seed/server-actions/400/300",
    category: "Next.js",
    author: {
      name: "Jane Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=janedoe",
    },
    publishDate: "Jun 29, 2026",
    readingTime: "5 min read",
    viewCount: 32100,
    reactionCount: 2450,
    commentCount: 128,
    bookmarkCount: 512,
    featured: false,
  },
  {
    id: "t2",
    title: "The Hidden Cost of Client-Side Data Fetching",
    excerpt:
      "Waterfalls, layout shift, and how to move work back to the server.",
    coverImage: "https://picsum.photos/seed/data-fetching/400/300",
    category: "Performance",
    author: {
      name: "Marcus Lee",
      avatarUrl: "https://i.pravatar.cc/150?u=marcuslee",
    },
    publishDate: "Jun 26, 2026",
    readingTime: "8 min read",
    viewCount: 28700,
    reactionCount: 2110,
    commentCount: 104,
    bookmarkCount: 468,
    featured: false,
  },
  {
    id: "t3",
    title: "Designing a Scalable Multi-Author Content Model",
    excerpt:
      "Roles, revisions, and moderation flows that hold up under real editorial load.",
    coverImage: "https://picsum.photos/seed/content-model/400/300",
    category: "Architecture",
    author: {
      name: "Priya Nair",
      avatarUrl: "https://i.pravatar.cc/150?u=priyanair",
    },
    publishDate: "Jun 23, 2026",
    readingTime: "10 min read",
    viewCount: 21500,
    reactionCount: 1680,
    commentCount: 87,
    bookmarkCount: 389,
    featured: false,
  },
  {
    id: "t4",
    title: "From Markdown to Rich Content: A Rendering Pipeline",
    excerpt:
      "Syntax highlighting, sanitization, and caching rendered HTML for speed.",
    coverImage: "https://picsum.photos/seed/markdown-pipeline/400/300",
    category: "Tooling",
    author: {
      name: "Alice Johnson",
      avatarUrl: "https://i.pravatar.cc/150?u=alicejohnson",
    },
    publishDate: "Jun 19, 2026",
    readingTime: "7 min read",
    viewCount: 19800,
    reactionCount: 1520,
    commentCount: 79,
    bookmarkCount: 341,
    featured: false,
  },
];
