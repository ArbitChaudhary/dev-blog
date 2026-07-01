import {
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    publishDate: string;
    readingTime: string;
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  isOwner?: boolean;
}

export function BlogCard({ post, isOwner = false }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <img
          src={post.coverImage}
          alt={post.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
          {post.category}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{post.publishDate}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-muted-foreground text-sm mt-auto pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {post.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> {post.likes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> {post.comments}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" /> {post.bookmarks}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2">
        <Button variant="default" className="flex-1">
          Read Article <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        {isOwner && (
          <>
            <Button size="icon" variant="outline" title="Edit">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
