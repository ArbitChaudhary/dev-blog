import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Bookmark, ArrowRight } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HomePost } from "../_lib/mock-home-data";

interface HomeBlogCardProps {
  post: HomePost;
}

export function HomeBlogCard({ post }: HomeBlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full pt-0 hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
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

        <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-muted-foreground text-sm mt-auto pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {post.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />{" "}
              {post.reactionCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> {post.commentCount}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" /> {post.bookmarkCount}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/blogs/${post.id}`}>
            Read Article <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
