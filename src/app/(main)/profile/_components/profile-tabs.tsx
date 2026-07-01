import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FileEdit,
  Bookmark,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwner?: boolean;
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  isOwner = false,
}: ProfileTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "posts", label: "Posts", icon: FileText },
    ...(isOwner ? [{ id: "drafts", label: "Drafts", icon: FileEdit }] : []),
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "comments", label: "Comments", icon: MessageSquare },
    ...(isOwner ? [{ id: "settings", label: "Settings", icon: Settings }] : []),
  ];

  return (
    <div className="w-full border-b mb-6 overflow-x-auto no-scrollbar">
      <div className="flex min-w-max space-x-1 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-md transition-all duration-200 border-b-2",
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
