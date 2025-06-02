"use client"

import { useMutation } from "@tanstack/react-query";

interface WebSocketInfo {
    ws_url: string;
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


export function useWebsocketConnection() {
    const connectMutation = useMutation({
        mutationFn: async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No authentication token found");
            }

            try {
                const info = await getWebSocketInfo(accessToken);

                return {
                    wsUrl: info.ws_url,
                    accessToken: accessToken
                };
            } catch (error) {
                console.error("WebSocket connection failed:", error);
            }
        }
    });

    return {
        connect: () => {
            return new Promise<void>((resolve, reject) => {
                // Only trigger mutation if not already connecting
                if (!connectMutation.isPending) {
                    connectMutation.mutate(undefined, {
                        onSuccess: () => {
                            console.log("WebSocket connection successful");
                            resolve();
                        },
                        onError: (error) => {
                            console.error("WebSocket connection failed:", error);
                            reject(error);
                        }
                    });
                } else {
                    resolve(); // Resolve immediately if already connecting
                }
            });
        },
        isConnecting: connectMutation.isPending,
        error: connectMutation.error,
        isError: connectMutation.isError
    };
}
