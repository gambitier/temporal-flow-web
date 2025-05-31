"use client"

import { useMutation } from "@tanstack/react-query";
import websocketService from "@/lib/services/websocket";

interface WebSocketInfo {
    ws_url: string;
}

interface SubscriptionTokenResponse {
    accessToken: string;
}

interface ConnectionData {
    wsUrl: string;
    subscriptionToken: string;
    accessToken: string;
}

async function getWebSocketInfo(token: string): Promise<WebSocketInfo> {
    const response = await fetch("http://localhost:8085/api/v1/ws/info", {
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to get connection info");
    }

    const data = await response.json();
    if (!data.ws_url) {
        throw new Error("WebSocket URL not provided in server response");
    }

    return data;
}

async function getSubscriptionToken(token: string): Promise<SubscriptionTokenResponse> {
    const personalChannel = "personal";

    const response = await fetch(
        `http://localhost:8085/api/v1/ws/token/subscription/${personalChannel}`,
        {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({}),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to get subscription token");
    }

    const data = await response.json();
    if (!data.accessToken) {
        throw new Error("Subscription token not provided in server response");
    }

    return data;
}

// Keep track of connection attempts
let isConnecting = false;
let connectionPromise: Promise<ConnectionData> | null = null;

export function useWebsocketConnection() {
    const connectMutation = useMutation({
        mutationFn: async () => {
            // If already connecting, return the existing promise
            if (isConnecting && connectionPromise) {
                return connectionPromise;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No authentication token found");
            }

            isConnecting = true;
            connectionPromise = (async () => {
                try {
                    const [info, subscriptionTokenData] = await Promise.all([
                        getWebSocketInfo(accessToken),
                        getSubscriptionToken(accessToken)
                    ]);

                    return {
                        wsUrl: info.ws_url,
                        subscriptionToken: subscriptionTokenData.accessToken,
                        accessToken: accessToken
                    };
                } finally {
                    isConnecting = false;
                    connectionPromise = null;
                }
            })();

            return connectionPromise;
        },
        onSuccess: (data) => {
            if (data) {
                websocketService.connect(data.wsUrl, data.accessToken);
            }
        },
        onError: (error) => {
            console.error("WebSocket connection failed:", error);
            isConnecting = false;
            connectionPromise = null;
        }
    });

    return {
        connect: () => {
            // Only trigger mutation if not already connecting
            if (!isConnecting) {
                connectMutation.mutate();
            }
        },
        isConnecting: connectMutation.isPending || isConnecting,
        error: connectMutation.error,
        isError: connectMutation.isError
    };
} 