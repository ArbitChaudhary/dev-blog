import { BookmarkMinus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookmarkCardProps {
  bookmark: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    category: string;
    readingTime: string;
    bookmarkedDate: string;
  };
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
        <img
          src={bookmark.coverImage}
          alt={bookmark.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 text-foreground">
          {bookmark.category}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-1">
              {bookmark.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              By{" "}
              <span className="font-medium text-foreground">
                {bookmark.author}
              </span>{" "}
              • {bookmark.readingTime}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <BookmarkMinus className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Bookmarked on {bookmark.bookmarkedDate}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            Read Article <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
