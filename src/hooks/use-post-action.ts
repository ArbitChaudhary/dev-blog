"use client";

import { useCallback, useMemo } from "react";

import { useAuthUser } from "@/hooks/use-auth-user";
import { useModelAction } from "@/hooks/use-model-action";
import type { CreateBlogPostInput } from "@/app/(main)/blogs/_common/blog-types";

/**
 * Convenience wrapper around {@link useModelAction} for the `BlogPost` model.
 *
 * Handles blog-specific concerns (author injection, storage folder) while
 * delegating uploads + persistence to the generic action hook.
 *
 * @example
 * const { createPost, isSubmitting, progress } = usePostAction();
 * await createPost({ title, content, coverImage: fileFromForm, ... });
 */
export function usePostAction() {
  const { user } = useAuthUser();
  const action = useModelAction("BlogPost", { uploadFolder: "blogs" });

  const createPost = useCallback(
    (input: CreateBlogPostInput) => {
      if (!user?.userId) {
        throw new Error("You must be signed in to create a post.");
      }
      return action.create({ ...input, authorId: user.userId });
    },
    [action, user],
  );

  const updatePost = useCallback(
    (id: string, input: Partial<CreateBlogPostInput>) =>
      action.update({ ...input, id }),
    [action],
  );

  return useMemo(
    () => ({ ...action, createPost, updatePost }),
    [action, createPost, updatePost],
  );
}
