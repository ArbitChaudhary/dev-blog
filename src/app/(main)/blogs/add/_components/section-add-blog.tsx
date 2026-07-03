"use client";

import { useRouter } from "next/navigation";

import { BlogPostForm } from "../../_common/blog-post-form";
import type { CreateBlogPostInput } from "../../_common/blog-types";
import { usePostAction } from "@/hooks/use-post-action";

function SectionAddBlog() {
  const router = useRouter();
  const { createPost, isSubmitting, isUploading, progress, error } =
    usePostAction();

  const handleSubmit = async (data: CreateBlogPostInput) => {
    try {
      const created = await createPost(data);
      if (created) {
        router.push("/blogs");
      }
    } catch {
      // Error surfaced below via the hook's `error` state.
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a new post</h1>
        <p className="text-muted-foreground">
          Share your ideas with the community. Fill in the details below to
          publish your blog post.
        </p>
      </div>

      {isUploading && progress && (
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Uploading images ({progress.completedFiles}/{progress.totalFiles})
            </span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <BlogPostForm
        mode="add"
        isLoading={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default SectionAddBlog;
