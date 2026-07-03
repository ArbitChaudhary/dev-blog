"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HomePost } from "../_lib/mock-home-data";

interface HeroSliderProps {
  posts: HomePost[];
  intervalMs?: number;
}

const CARD_WIDTH = 220;
const CARD_GAP = 16;

export function HeroSlider({ posts, intervalMs = 4000 }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const count = posts.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs]);

  if (count === 0) return null;

  const activePost = posts[active];

  // Left-align the track so the active card sits at the left edge of the
  // strip. Later cards trail off to the right and are clipped by overflow.
  const trackOffset = -(active * (CARD_WIDTH + CARD_GAP));

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured posts"
      className="relative h-[calc(100svh-3.5rem)] w-full overflow-hidden"
    >
      {/* Full-screen cover of the active (rightmost) post */}
      {posts.map((post, index) => (
        <Image
          key={post.id}
          src={post.coverImage}
          alt={post.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-1000 ease-in-out",
            index === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />

      {/* Active post headline */}
      <div className="absolute inset-x-0 top-0 flex flex-col justify-center px-6 pt-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            {activePost.category}
          </Badge>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {activePost.title}
          </h1>
          <p className="mt-4 line-clamp-3 max-w-xl text-sm text-white/80 sm:text-lg">
            {activePost.excerpt}
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href={`/blogs/${activePost.id}`}>
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Auto-sliding featured cards — bottom right */}
      <div className="absolute bottom-8 right-0 flex w-full justify-end px-6 sm:px-10 lg:px-16">
        <div className="max-w-xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              gap: `${CARD_GAP}px`,
              transform: `translateX(${trackOffset}px)`,
            }}
          >
            {posts.map((post, index) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show ${post.title}`}
                aria-current={index === active}
                className={cn(
                  "group shrink-0 text-left transition-all duration-500",
                  index === active
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-90",
                )}
                style={{ width: `${CARD_WIDTH}px` }}
              >
                <p className="mb-2 line-clamp-2 text-xs font-semibold text-white">
                  {post.title}
                </p>
                <div
                  className={cn(
                    "relative aspect-video w-full overflow-hidden rounded-xl border transition-all duration-500",
                    index === active
                      ? "border-primary ring-2 ring-primary"
                      : "border-white/20",
                  )}
                >
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
