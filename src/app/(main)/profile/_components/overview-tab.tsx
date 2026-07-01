import { AnalyticsCards } from "./analytics-cards";
import { ActivityTimeline } from "./activity-timeline";
import { BlogCard } from "./blog-card";
import { DraftCard } from "./draft-card";
import { ArrowRight, FileText, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewTabProps {
  analytics: any; // Using any for brevity, typically would match mock data structure
  activities: any[];
  recentPosts: any[];
  recentDrafts: any[];
  onTabChange: (tab: string) => void;
}

export function OverviewTab({
  analytics,
  activities,
  recentPosts,
  recentDrafts,
  onTabChange,
}: OverviewTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnalyticsCards stats={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Published Posts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Posts
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("posts")}
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Drafts Summary */}
          {recentDrafts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-primary" />
                  Recent Drafts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange("drafts")}
                >
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-3">
                {recentDrafts.slice(0, 3).map((draft) => (
                  <DraftCard key={draft.id} draft={draft} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Activity */}
        <div className="lg:col-span-1">
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}
