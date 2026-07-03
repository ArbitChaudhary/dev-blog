import { TrendingUp } from "lucide-react";

import { TrendingCard } from "./trending-card";
import { trendingPosts } from "../_lib/mock-home-data";

export function TrendingSection() {
  const posts = [...trendingPosts]
    .sort(
      (a, b) => b.viewCount + b.reactionCount - (a.viewCount + a.reactionCount),
    )
    .slice(0, 4);

  return (
    <section aria-labelledby="trending-heading">
      <div className="mb-8 flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        <div>
          <h2 id="trending-heading" className="text-2xl font-bold sm:text-3xl">
            Trending Now
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The most read and reacted-to posts this week.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post, index) => (
          <TrendingCard key={post.id} post={post} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
