import {
  UserCircle,
  Lock,
  Bell,
  Palette,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsTab() {
  const settingsLinks = [
    {
      title: "Edit Profile",
      description: "Update your personal information and bio.",
      icon: UserCircle,
      action: "edit-profile",
    },
    {
      title: "Account Security",
      description: "Change your password and manage authentication.",
      icon: Lock,
      action: "change-password",
    },
    {
      title: "Notifications",
      description: "Manage email and push notification preferences.",
      icon: Bell,
      action: "notifications",
    },
    {
      title: "Appearance",
      description: "Customize the theme and layout of your dashboard.",
      icon: Palette,
      action: "appearance",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Settings & Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsLinks.map((setting) => {
            const Icon = setting.icon;
            return (
              <Card
                key={setting.action}
                className="hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-xl font-bold text-destructive mb-4">Danger Zone</h3>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold mb-1">Delete Account</h4>
              <p className="text-sm text-muted-foreground max-w-xl">
                Permanently remove your account, all your posts, comments, and
                data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" className="shrink-0">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
