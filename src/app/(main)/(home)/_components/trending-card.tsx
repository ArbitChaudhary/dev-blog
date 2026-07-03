import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { HomePost } from "../_lib/mock-home-data";

interface TrendingCardProps {
  post: HomePost;
  rank: number;
}

export function TrendingCard({ post, rank }: TrendingCardProps) {
  return (
    <Link
      href={`/blogs/${post.id}`}
      className="group flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-accent"
    >
      <span className="w-8 shrink-0 text-2xl font-bold tabular-nums text-muted-foreground/60">
        {rank.toString().padStart(2, "0")}
      </span>

      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <Badge variant="secondary" className="mb-1.5">
          {post.category}
        </Badge>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:underline">
          {post.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {post.viewCount.toLocaleString()} views
        </p>
      </div>
    </Link>
  );
}
