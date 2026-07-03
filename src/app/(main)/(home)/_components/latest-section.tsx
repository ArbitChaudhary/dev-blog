import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HomeBlogCard } from "./home-blog-card";
import { latestPosts } from "../_lib/mock-home-data";

export function LatestSection() {
  const posts = latestPosts.slice(0, 4);

  return (
    <section aria-labelledby="latest-heading">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 id="latest-heading" className="text-2xl font-bold sm:text-3xl">
            Latest Posts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fresh reads from our community of authors.
          </p>
        </div>
        <Button asChild variant="ghost" className="shrink-0">
          <Link href="/blogs">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <HomeBlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
