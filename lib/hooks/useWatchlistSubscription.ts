"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import websocketService from "@/lib/services/websocket";

interface WatchlistSubscriptionToken {
    accessToken: string;
}

export function useWatchlistSubscription() {
    const [currentWatchlistId, setCurrentWatchlistId] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);

    const getSubscriptionToken = useMutation({
        mutationFn: async (watchlistId: string) => {
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

        // If we're already subscribing to this watchlist, don't try again
        if (isSubscribing && currentWatchlistId === watchlistId) {
            console.log("Already subscribing to watchlist:", watchlistId);
            return;
        }

        try {
            setIsSubscribing(true);
            console.log("Subscribing to watchlist:", watchlistId);

            // Get new subscription token
            const token = await getSubscriptionToken.mutateAsync(watchlistId);

            // Subscribe to new watchlist
            const channel = `watchlist:${watchlistId}`;
            console.log("Creating subscription for channel:", channel);
            const subscription = websocketService.createSubscription(channel, token);

            subscription.on("subscribing", (ctx: any) => {
                console.log("Subscribing to channel:", channel, ctx);
            });

            subscription.on("subscribed", (ctx: any) => {
                console.log("Subscribed to channel:", channel, ctx);
                setCurrentWatchlistId(watchlistId);
                setIsSubscribing(false);
            });

            subscription.on("unsubscribed", (ctx: any) => {
                console.log("Unsubscribed from channel:", channel, ctx);
                if (currentWatchlistId === watchlistId) {
                    setCurrentWatchlistId(null);
                }
            });

            subscription.on("error", (ctx: any) => {
                console.error("Subscription error for channel:", channel, ctx);
                setIsSubscribing(false);
                if (currentWatchlistId === watchlistId) {
                    setCurrentWatchlistId(null);
                }
            });

            subscription.on("publication", (ctx: any) => {
                console.log("Received watchlist update for channel:", channel, ctx);
                // Handle watchlist updates here
            });

            subscription.subscribe();
            console.log("Successfully subscribed to watchlist:", watchlistId);
        } catch (error) {
            console.error("Error subscribing to watchlist:", watchlistId, error);
            setIsSubscribing(false);
            if (currentWatchlistId === watchlistId) {
                setCurrentWatchlistId(null);
            }
            throw error;
        }
    }, [currentWatchlistId, getSubscriptionToken, isSubscribing]);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (currentWatchlistId) {
                setCurrentWatchlistId(null);
            }
        };
    }, [currentWatchlistId]);

    return {
        subscribeToWatchlist,
        isSubscribing: isSubscribing || getSubscriptionToken.isPending,
        error: getSubscriptionToken.error,
    };
} 