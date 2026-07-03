import { z } from "zod";

export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogPostVisibility = "PUBLIC" | "PRIVATE";

export interface BlogPostAuthor {
  id: string;
  fullname: string | null;
  email: string;
  profilePicture: string | null;
}

export interface BlogPost {
  id: string;
  authorId: string;
  categoryId: string | null;
  author?: BlogPostAuthor | null;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: BlogPostStatus;
  visibility: BlogPostVisibility;
  featured: boolean;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export const blogPostStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const blogPostVisibilityEnum = z.enum(["PUBLIC", "PRIVATE"]);

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title must be at most 160 characters"),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt must be at most 300 characters")
    .optional()
    .or(z.literal("")),
  categoryId: z
    .string()
    .trim()
    .min(1, "Please select a category")
    .optional()
    .or(z.literal("")),
  coverImage: z
    .union([
      z.string().trim().url("Cover image must be a valid URL"),
      z.instanceof(File),
    ])
    .optional()
    .or(z.literal("")),
  status: blogPostStatusEnum.default("DRAFT"),
  visibility: blogPostVisibilityEnum.default("PUBLIC"),
  featured: z.boolean().default(false),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
