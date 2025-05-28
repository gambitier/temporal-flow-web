"use client";

import AuthCheck from "@/components/auth/AuthCheck";

export default function DashboardPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-4 text-gray-600">Welcome to your dashboard!</p>
        </div>
      </div>
    </AuthCheck>
  );
}
