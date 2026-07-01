import { ContentEmptyState } from "./empty-state"; // Wait, I named it EmptyState. I will import directly.
import { EmptyState } from "./empty-state";
import { BlogCard } from "./blog-card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostsTabProps {
  posts: any[];
  isOwner: boolean;
}

export function PostsTab({ posts, isOwner }: PostsTabProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No published posts yet"
        description={
          isOwner
            ? "You haven't published any articles yet. Start writing to share your knowledge!"
            : "This author hasn't published any articles yet."
        }
        actionLabel={isOwner ? "Write your first post" : undefined}
        onAction={() => console.log("Create new post")}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Published Posts ({posts.length})</h2>
        {isOwner && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} isOwner={isOwner} />
        ))}
      </div>
    </div>
  );
}
