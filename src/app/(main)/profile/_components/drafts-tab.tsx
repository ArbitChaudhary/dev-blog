import { EmptyState } from "./empty-state";
import { DraftCard } from "./draft-card";
import { FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraftsTabProps {
  drafts: any[];
}

export function DraftsTab({ drafts }: DraftsTabProps) {
  if (drafts.length === 0) {
    return (
      <EmptyState
        icon={FileEdit}
        title="No open drafts"
        description="You don't have any drafts. Start a new article whenever you're ready."
        actionLabel="Start a draft"
        onAction={() => console.log("Create new post")}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Drafts ({drafts.length})</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Draft
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
}
