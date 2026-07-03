import type { Metadata } from "next";

import SectionAddBlog from "./_components/section-add-blog";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Write and publish a new blog post.",
};

export default function AddBlogPage() {
  return <SectionAddBlog />;
}
