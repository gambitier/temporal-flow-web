"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Activity, Clock, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: "Active Workflows",
      value: "12",
      icon: Activity,
      change: "+4.75%",
      changeType: "positive",
    },
    {
      name: "Average Duration",
      value: "2.5h",
      icon: Clock,
      change: "+1.39%",
      changeType: "positive",
    },
    {
      name: "Team Members",
      value: "8",
      icon: Users,
      change: "+2",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading1">
          Welcome back, {user ? `${user.first_name} ${user.last_name}` : "User"}
          !
        </h1>
        <p className="subtitle1 mt-1">
          Here's what's happening with your workflows today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-card text-card-foreground px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-purple-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate body2 font-medium">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="heading2">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline body2 font-semibold ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="heading2">Recent Activity</h2>
          <div className="mt-6">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                          <Activity className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="body2">
                            Workflow{" "}
                            <span className="font-medium text-foreground">
                              #1234
                            </span>{" "}
                            completed
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right body2">
                          <time dateTime="2024-03-20">3h ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <Users className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="body2">
                            New team member{" "}
                            <span className="font-medium text-foreground">
                              John Doe
                            </span>{" "}
                            joined
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right body2">
                          <time dateTime="2024-03-19">1d ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
