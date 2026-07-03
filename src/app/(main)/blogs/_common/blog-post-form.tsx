"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ControlledInput } from "@/components/reusable/controlled-input";
import { ControlledEditor } from "@/components/reusable/controlled-editor";
import { ControlledFileUpload } from "@/components/reusable/controlled-file-upload";
import {
  ControlledSelect,
  type SelectOption,
} from "@/components/reusable/controlled-select";
import { ControlledSwitch } from "@/components/reusable/controlled-switch";
import { ButtonLoading } from "@/components/reusable/buttons/button-loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { createBlogPostSchema, type CreateBlogPostInput } from "./blog-types";

export type BlogPostFormMode = "add" | "edit";

type BlogPostFormProps = {
  mode: BlogPostFormMode;
  isLoading?: boolean;
  initialData?: Partial<CreateBlogPostInput>;
  onSubmit: (data: CreateBlogPostInput) => void | Promise<void>;
  categoryOptions?: SelectOption[];
};

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

const VISIBILITY_OPTIONS: SelectOption[] = [
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
];

const DEFAULT_VALUES: CreateBlogPostInput = {
  title: "",
  content: "",
  excerpt: "",
  categoryId: "",
  coverImage: "",
  status: "DRAFT",
  visibility: "PUBLIC",
  featured: false,
};

function BlogPostForm({
  mode,
  isLoading = false,
  initialData,
  onSubmit,
  categoryOptions = [],
}: BlogPostFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialData,
    },
  });

  const submitting = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      {/* Left Column: Post Details */}
      <div className="flex flex-col gap-8 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ControlledInput
              name="title"
              control={control}
              label="Title"
              placeholder="Enter a compelling title"
            />

            <ControlledEditor
              name="content"
              control={control}
              label="Content"
              placeholder="Write your story..."
            />

            <ControlledInput
              name="excerpt"
              control={control}
              label="Excerpt"
              placeholder="A short summary of your post"
            />

            <ControlledFileUpload
              name="coverImage"
              control={control}
              label="Cover Image"
              description="Upload a cover image for your blog post."
              recommendedDimensions="1200 x 630 px"
              maxSizeMB={5}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Metadata & Actions */}
      <div className="flex flex-col gap-8 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
        {/* Publishing Card */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ControlledSelect
              name="status"
              control={control}
              label="Status"
              options={STATUS_OPTIONS}
            />

            <ControlledSelect
              name="visibility"
              control={control}
              label="Visibility"
              options={VISIBILITY_OPTIONS}
            />

            <ControlledSwitch
              name="featured"
              control={control}
              label="Featured"
              description="Highlight this post across the site"
            />
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <ButtonLoading
              type="submit"
              label={mode === "add" ? "Create Post" : "Save Changes"}
              isLoading={submitting}
              className="w-full"
            />
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}

export { BlogPostForm };
