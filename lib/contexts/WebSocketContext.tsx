"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebsocketConnection } from "@/lib/hooks/useWebsocketConnection";
import { usePersonalSubscription } from "@/lib/hooks/usePersonalSubscription";
import websocketService from "@/lib/services/websocket";

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
        // First connect to WebSocket
        await connect();
        setIsConnected(true);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to connect:", err);
        setError(err instanceof Error ? err : new Error("Failed to connect"));
        setIsConnected(false);
      }
    };

    // Subscribe to personal channel when WebSocket is connected
    const handleConnected = async () => {
      try {
        await subscribeToPersonal();
      } catch (err: unknown) {
        console.error("Failed to subscribe to personal channel:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to subscribe to personal channel")
        );
      }
    };

    // Set up WebSocket event listeners
    websocketService.on("connected", handleConnected);

    handleConnect();

    return () => {
      // Clean up event listeners
      websocketService.off("connected", handleConnected);
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

export const useWebSocket = () => useContext(WebSocketContext);
