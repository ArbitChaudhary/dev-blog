import { BlogsFilterBar } from "./_components/blogs-filter-bar";
import { HomeBlogCard } from "@/app/(main)/(home)/_components/home-blog-card";
import { Button } from "@/components/ui/button";
import { latestPosts } from "@/app/(main)/(home)/_lib/mock-home-data";

export default function BlogsPage() {
  // Using mock data for now. We can slice it or map it as needed.
  // Using latestPosts directly.
  const posts = latestPosts;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Explore Articles
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover our latest insights, tutorials, and stories.
        </p>
      </div>

      {/* Filter Section */}
      <BlogsFilterBar />

      {/* Grid Layout */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <HomeBlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-card">
          No articles found matching your criteria.
        </div>
      )}

      {/* Pagination Footer */}
      {posts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
