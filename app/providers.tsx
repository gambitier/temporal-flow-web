"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { WebSocketProvider } from "@/lib/contexts/WebSocketContext";
import { useState } from "react";

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
