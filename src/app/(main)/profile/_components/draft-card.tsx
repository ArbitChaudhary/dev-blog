import { FileEdit, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DraftCardProps {
  draft: {
    id: string;
    title: string;
    lastEdited: string;
  };
}

export function DraftCard({ draft }: DraftCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:shadow-md transition-shadow">
      <div className="space-y-1 sm:flex-1 mb-4 sm:mb-0">
        <h3 className="font-semibold text-lg line-clamp-1">{draft.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Last edited {draft.lastEdited}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="default" size="sm">
          <FileEdit className="w-4 h-4 mr-2" />
          Continue Writing
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
