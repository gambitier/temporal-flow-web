"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useWebsocketConnection } from "@/lib/hooks/useWebsocketConnection";
import { usePersonalSubscription } from "@/lib/hooks/usePersonalSubscription";
import websocketService from "@/lib/services/websocket";

const WebSocketContext = createContext({});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { connect } = useWebsocketConnection();
  const { subscribeToPersonal } = usePersonalSubscription();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const connectToWebsocket = async () => {
      try {
        // First connect to WebSocket
        await connect();
      } catch (err: unknown) {
        console.error("Failed to connect:", err);
      }
    };

    // Subscribe to personal channel when WebSocket is connected
    const handleConnected = async () => {
      try {
        await subscribeToPersonal();
      } catch (err: unknown) {
        console.error("Failed to subscribe to personal channel:", err);
      }
    };

    // Set up WebSocket event listeners
    const onConnected = (ctx: any) => {
      console.log("received event: WebSocket connected:", ctx);
      handleConnected();
    };

    websocketService.on("connected", onConnected);

    connectToWebsocket();

    return () => {
      // Cleanup function to remove event listener, so that handleConnected is not called multiple times
      websocketService.off("connected", onConnected);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
