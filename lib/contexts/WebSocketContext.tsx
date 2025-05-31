"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebsocketConnection } from "@/lib/hooks/useWebsocketConnection";
import { usePersonalSubscription } from "@/lib/hooks/usePersonalSubscription";

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  isConnecting: false,
  error: null,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { connect, isConnecting } = useWebsocketConnection();
  const { subscribeToPersonal, isSubscribing: isPersonalSubscribing } =
    usePersonalSubscription();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    const handleConnect = async () => {
      try {
        await connect();
        setIsConnected(true);
        setError(null);
        await subscribeToPersonal();
      } catch (err: unknown) {
        console.error("Failed to connect or subscribe:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect or subscribe")
        );
        setIsConnected(false);
      }
    };

    handleConnect();

    return () => {
      // Cleanup will be handled by the WebSocket service
    };
  }, []); // Empty dependency array since we only want to run this once

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        isConnecting: isConnecting || isPersonalSubscribing,
        error,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
