"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  LineChart,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import AuthCheck from "@/components/auth/AuthCheck";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
  { name: "Trading", href: "/dashboard/trading", icon: LineChart },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Generate breadcrumbs
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + array.slice(0, index + 1).join("/"),
      isLast: index === array.length - 1,
    }));

  return (
    <AuthCheck>
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Temporal Flow
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? "text-purple-600 dark:text-purple-200"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex h-16 items-center justify-between px-4">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 ${
                  isCollapsed ? "justify-center w-full" : ""
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Temporal Flow
                  </span>
                )}
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-purple-600 dark:text-purple-200"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                      } ${!isCollapsed ? "mr-3" : ""}`}
                    />
                    {!isCollapsed && item.name}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Logout" : ""}
              >
                <LogOut
                  className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300 ${
                    !isCollapsed ? "mr-3" : ""
                  }`}
                />
                {!isCollapsed && "Logout"}
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
        >
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
            <div className="flex flex-1 items-center px-4">
              <button
                type="button"
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="hidden lg:block px-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Toggle sidebar</span>
                {isCollapsed ? (
                  <ChevronRight className="h-6 w-6" />
                ) : (
                  <ChevronLeft className="h-6 w-6" />
                )}
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Home className="h-5 w-5" />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <Link
                      href={crumb.href}
                      className={`ml-2 text-sm font-medium ${
                        crumb.isLast
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-64 bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
