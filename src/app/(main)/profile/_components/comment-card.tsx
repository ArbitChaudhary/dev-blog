import { MessageSquare, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CommentCardProps {
  comment: {
    id: string;
    blogTitle: string;
    blogId: string;
    preview: string;
    date: string;
  };
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 py-1.5 px-3 rounded-md w-fit">
            <MessageSquare className="w-4 h-4" />
            <span>Commented on</span>
            <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
              {comment.blogTitle}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {comment.date}
          </span>
        </div>

        <p className="text-foreground border-l-2 border-primary/30 pl-4 py-1 italic mb-4">
          "{comment.preview}"
        </p>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground h-8"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Delete Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
