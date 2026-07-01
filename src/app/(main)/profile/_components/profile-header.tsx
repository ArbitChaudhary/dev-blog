import { MapPin, Link as LinkIcon, Calendar, Edit } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    websiteUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    joinDate: string;
  };
  isOwner: boolean;
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 border rounded-2xl bg-card">
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-sm">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback className="text-3xl">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          {isOwner && (
            <Button variant="outline" className="shrink-0">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {user.bio && (
          <p className="text-sm md:text-base max-w-2xl">{user.bio}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.websiteUrl && (
            <a
              href={user.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>{getHostname(user.websiteUrl)}</span>
            </a>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Joined {user.joinDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          )}
          {user.twitterUrl && (
            <a
              href={user.twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
          )}
          {user.linkedinUrl && (
            <a
              href={user.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
