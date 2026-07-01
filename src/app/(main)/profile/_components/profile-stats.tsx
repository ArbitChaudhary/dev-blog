import {
  FileText,
  FileEdit,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  stats: {
    publishedPosts: number;
    drafts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    bookmarksReceived: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Drafts",
      value: stats.drafts,
      icon: FileEdit,
      color: "text-orange-500",
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-500",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Comments",
      value: stats.totalComments.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-500",
    },
    {
      label: "Bookmarks",
      value: stats.bookmarksReceived.toLocaleString(),
      icon: Bookmark,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`p-2 rounded-full bg-muted ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
