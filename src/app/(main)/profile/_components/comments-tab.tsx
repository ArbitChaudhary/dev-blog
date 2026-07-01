import { EmptyState } from "./empty-state";
import { CommentCard } from "./comment-card";
import { MessageSquare } from "lucide-react";

interface CommentsTabProps {
  comments: any[];
}

export function CommentsTab({ comments }: CommentsTabProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No comments yet"
        description="You haven't participated in any discussions. Leave a comment on posts to engage with authors."
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Your Comments ({comments.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
