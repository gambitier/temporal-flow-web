"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { WebSocketProvider } from "@/lib/contexts/WebSocketContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/dashboard");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {isAuthRoute ? (
          <WebSocketProvider>{children}</WebSocketProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
