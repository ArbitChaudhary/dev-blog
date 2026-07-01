import {
  BarChart3,
  TrendingUp,
  FileText,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsProps {
  stats: {
    totalViews: number;
    viewsThisMonth: number;
    publishedPosts: number;
    drafts: number;
    popularPostTitle: string;
    popularPostViews: number;
  };
}

export function AnalyticsCards({ stats }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalViews.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all publications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Views This Month
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            +{stats.viewsThisMonth.toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1" /> 12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publishedPosts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            + {stats.drafts} drafts in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Post</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div
            className="text-sm font-semibold line-clamp-1"
            title={stats.popularPostTitle}
          >
            {stats.popularPostTitle}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.popularPostViews.toLocaleString()} views
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
