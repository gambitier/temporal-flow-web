"use client";

import { useState } from "react";
import { Bell, Lock, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    twoFactor: false,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application preferences and security settings.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-md bg-purple-100 p-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("notifications")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  settings.notifications ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-md bg-purple-100 p-2">
                  {settings.darkMode ? (
                    <Moon className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Sun className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("darkMode")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  settings.darkMode ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-md bg-purple-100 p-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("twoFactor")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  settings.twoFactor ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.twoFactor ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
