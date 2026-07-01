import {
  PenTool,
  MessageSquare,
  Bookmark,
  Edit3,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: string; // 'published' | 'updated' | 'bookmarked' | 'commented'
  target: string;
  date: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "published":
        return <PenTool className="h-4 w-4 text-primary" />;
      case "updated":
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case "bookmarked":
        return <Bookmark className="h-4 w-4 text-orange-500" />;
      case "commented":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <PenTool className="h-4 w-4" />;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case "published":
        return "Published a new post";
      case "updated":
        return "Updated the post";
      case "bookmarked":
        return "Bookmarked";
      case "commented":
        return "Commented on";
      default:
        return "Interacted with";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 relative">
              {/* Timeline connecting line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-4 top-10 -bottom-6 w-px bg-border"></div>
              )}

              <div className="relative mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background z-10 relative">
                  {getIcon(activity.type)}
                </div>
              </div>

              <div className="flex flex-col flex-1 pb-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    {getActionText(activity.type)}{" "}
                  </span>
                  <span className="text-primary hover:underline cursor-pointer font-medium">
                    "{activity.target}"
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {activity.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-6 text-muted-foreground">
          View All Activity <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
