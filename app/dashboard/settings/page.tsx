"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading1">Settings</h2>
        <p className="subtitle1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="heading2">Appearance</CardTitle>
            <CardDescription className="subtitle2">
              Customize how Temporal Flow looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 bg-card text-card-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading3">Dark Mode</h3>
                <p className="body2">Switch between light and dark themes</p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
