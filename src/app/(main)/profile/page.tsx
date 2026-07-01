"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  mockStats,
  mockPosts,
  mockDrafts,
  mockBookmarks,
  mockComments,
  mockActivity,
} from "./_lib/mock-data";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGetUserProfileQuery } from "@/redux/api/user-profile-api";

import { ProfileHeader } from "./_components/profile-header";
import { ProfileStats } from "./_components/profile-stats";
import { ProfileTabs } from "./_components/profile-tabs";
import { OverviewTab } from "./_components/overview-tab";
import { PostsTab } from "./_components/posts-tab";
import { DraftsTab } from "./_components/drafts-tab";
import { BookmarksTab } from "./_components/bookmarks-tab";
import { CommentsTab } from "./_components/comments-tab";
import { SettingsTab } from "./_components/settings-tab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user: authUser, isLoading: authLoading } = useAuthUser();
  const {
    data: profile,
    isLoading: profileLoading,
    isError,
  } = useGetUserProfileQuery(authUser?.userId ?? "", {
    skip: !authUser?.userId,
  });

  // Own profile for now; public/other-user profiles are out of scope.
  const isOwner = true;

  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto flex min-h-125 items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container mx-auto flex min-h-125 items-center justify-center px-4 py-8">
        <p className="text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto flex min-h-125 items-center justify-center px-4 py-8">
        <p className="text-destructive">
          Something went wrong loading your profile. Please try again.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto flex min-h-125 items-center justify-center px-4 py-8">
        <p className="text-muted-foreground">
          We couldn&apos;t find your profile. Complete your profile to get
          started.
        </p>
      </div>
    );
  }

  const headerUser = {
    name: profile.fullname || profile.email,
    username: authUser.username,
    avatarUrl: profile.profilePicture ?? undefined,
    bio: profile.bio ?? undefined,
    location: profile.address ?? undefined,
    websiteUrl: profile.websiteUrl ?? undefined,
    githubUrl: profile.githubUrl ?? undefined,
    twitterUrl: profile.twitterUrl ?? undefined,
    linkedinUrl: profile.linkedinUrl ?? undefined,
    joinDate: profile.createdAt
      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <ProfileHeader user={headerUser} isOwner={isOwner} />

        <ProfileStats stats={mockStats} />

        <div className="mt-8 rounded-xl border bg-card shadow-sm p-1">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwner={isOwner}
          />

          <div className="p-4 md:p-6 min-h-125">
            {activeTab === "overview" && (
              <OverviewTab
                analytics={{
                  totalViews: mockStats.totalViews,
                  viewsThisMonth: Math.round(mockStats.totalViews * 0.12),
                  publishedPosts: mockStats.publishedPosts,
                  drafts: mockStats.drafts,
                  popularPostTitle: mockPosts[0]?.title || "N/A",
                  popularPostViews: mockPosts[0]?.views || 0,
                }}
                activities={mockActivity}
                recentPosts={mockPosts}
                recentDrafts={mockDrafts}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === "posts" && (
              <PostsTab posts={mockPosts} isOwner={isOwner} />
            )}

            {activeTab === "drafts" && isOwner && (
              <DraftsTab drafts={mockDrafts} />
            )}

            {activeTab === "bookmarks" && (
              <BookmarksTab bookmarks={mockBookmarks} />
            )}

            {activeTab === "comments" && (
              <CommentsTab comments={mockComments} />
            )}

            {activeTab === "settings" && isOwner && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
