import { EmptyState } from "./empty-state";
import { BookmarkCard } from "./bookmark-card";
import { Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookmarksTabProps {
  bookmarks: any[];
}

export function BookmarksTab({ bookmarks }: BookmarksTabProps) {
  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Your reading list is empty"
        description="When you find an article you want to read later, click the bookmark icon to save it here."
        actionLabel="Explore articles"
        onAction={() => console.log("Go to home")}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Saved Bookmarks ({bookmarks.length})
        </h2>
        <Button variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Find more
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
