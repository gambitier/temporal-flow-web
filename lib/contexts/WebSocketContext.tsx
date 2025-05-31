"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connect = async () => {
      if (isConnecting || isConnected) return;

      try {
        setIsConnecting(true);
        setError(null);

        const response = await fetch("http://localhost:8085/api/v1/ws/info", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get connection info");
        }

        const info = await response.json();
        if (!info.ws_url) {
          throw new Error("WebSocket URL not provided in server response");
        }

        const subscriptionResponse = await fetch(
          `http://localhost:8085/api/v1/ws/token/subscription/personal`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({}),
          }
        );

        if (!subscriptionResponse.ok) {
          throw new Error("Failed to get subscription token");
        }

        const subscriptionData = await subscriptionResponse.json();
        if (!subscriptionData.accessToken) {
          throw new Error("Subscription token not provided in server response");
        }

        websocketService.connect(info.ws_url, subscriptionData.accessToken);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to WebSocket")
        );
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
      }
    };

    // Set up WebSocket event handlers
    const handleConnected = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleError = (err: Error) => {
      setError(err);
      setIsConnected(false);
    };

    websocketService.on("connected", handleConnected);
    websocketService.on("disconnected", handleDisconnected);
    websocketService.on("error", handleError);

    // Initial connection
    connect();

    // Cleanup
    return () => {
      websocketService.off("connected", handleConnected);
      websocketService.off("disconnected", handleDisconnected);
      websocketService.off("error", handleError);
      websocketService.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, isConnecting, error }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
