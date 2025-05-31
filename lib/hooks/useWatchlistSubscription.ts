"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import websocketService from "@/lib/services/websocket";

interface WatchlistSubscriptionToken {
    accessToken: string;
}

export function useWatchlistSubscription() {
    const currentSubscription = useRef<string | null>(null);

    const getSubscriptionToken = useMutation({
        mutationFn: async (watchlistId: string) => {
            console.log("Requesting subscription token for watchlist:", watchlistId);
            const watchlistChannel = "watchlist";
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`http://localhost:8085/api/v1/ws/token/subscription/${watchlistChannel}`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ watchlistId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to get subscription token:", errorText);
                throw new Error(`Failed to get subscription token: ${errorText}`);
            }

            const data: WatchlistSubscriptionToken = await response.json();
            console.log("Received subscription token response:", data);

            if (!data.accessToken) {
                throw new Error("No token in subscription response");
            }

            return data.accessToken;
        },
    });

    const subscribeToWatchlist = useCallback(async (watchlistId: string) => {
        if (!watchlistId) {
            console.warn("No watchlist ID provided for subscription");
            return;
        }

        try {
            console.log("Subscribing to watchlist:", watchlistId);

            // Unsubscribe from current watchlist if exists
            if (currentSubscription.current) {
                console.log("Unsubscribing from current watchlist:", currentSubscription.current);
                websocketService.unsubscribe(currentSubscription.current);
                currentSubscription.current = null;
            }

            // Get new subscription token
            const token = await getSubscriptionToken.mutateAsync(watchlistId);
            console.log("Got token for watchlist:", watchlistId, "Token:", token);

            // Subscribe to new watchlist
            const channel = `watchlist:${watchlistId}`;
            console.log("Creating subscription for channel:", channel);
            const subscription = websocketService.createSubscription(channel, token);
            currentSubscription.current = channel;

            subscription.on("subscribing", (ctx) => {
                console.log("Subscribing to channel:", channel, ctx);
            });

            subscription.on("subscribed", (ctx) => {
                console.log("Subscribed to channel:", channel, ctx);
            });

            subscription.on("unsubscribed", (ctx) => {
                console.log("Unsubscribed from channel:", channel, ctx);
            });

            subscription.on("error", (ctx) => {
                console.error("Subscription error for channel:", channel, ctx);
            });

            subscription.on("publication", (ctx) => {
                console.log("Received watchlist update for channel:", channel, ctx);
                // Handle watchlist updates here
            });

            subscription.subscribe();
            console.log("Successfully subscribed to watchlist:", watchlistId);
        } catch (error) {
            console.error("Error subscribing to watchlist:", watchlistId, error);
            throw error;
        }
    }, [getSubscriptionToken]);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (currentSubscription.current) {
                console.log("Cleaning up subscription for channel:", currentSubscription.current);
                websocketService.unsubscribe(currentSubscription.current);
                currentSubscription.current = null;
            }
        };
    }, []);

    return {
        subscribeToWatchlist,
        isSubscribing: getSubscriptionToken.isPending,
        error: getSubscriptionToken.error,
    };
} 