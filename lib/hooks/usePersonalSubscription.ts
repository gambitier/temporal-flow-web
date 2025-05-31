"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import websocketService from "@/lib/services/websocket";
import { jwtDecode } from "jwt-decode";

interface PersonalSubscriptionToken {
    accessToken: string;
}

interface JwtPayload {
    sub: string;
}

export function usePersonalSubscription() {
    const currentSubscription = useRef<string | null>(null);

    const getSubscriptionToken = useMutation({
        mutationFn: async () => {
            console.log("Requesting personal subscription token");
            const personalChannel = "personal";
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`http://localhost:8085/api/v1/ws/token/subscription/${personalChannel}`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to get personal subscription token:", errorText);
                throw new Error(`Failed to get personal subscription token: ${errorText}`);
            }

            const data: PersonalSubscriptionToken = await response.json();
            console.log("Received personal subscription token response:", data);

            if (!data.accessToken) {
                throw new Error("No token in personal subscription response");
            }

            return data.accessToken;
        },
    });

    const subscribeToPersonal = useCallback(async () => {
        try {
            console.log("Subscribing to personal channel");

            // Unsubscribe from current personal subscription if exists
            if (currentSubscription.current) {
                console.log("Unsubscribing from current personal channel:", currentSubscription.current);
                websocketService.unsubscribe(currentSubscription.current);
                currentSubscription.current = null;
            }

            // Get new subscription token
            const token = await getSubscriptionToken.mutateAsync();
            console.log("Got personal subscription token:", token);

            // Get user ID from token
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No authentication token found");
            }
            const decoded = jwtDecode<JwtPayload>(accessToken);
            const userId = decoded.sub;
            console.log("Got user ID from token:", userId);

            // Subscribe to personal channel
            const channel = `personal:${userId}`;
            console.log("Creating subscription for personal channel:", channel);
            const subscription = websocketService.createSubscription(channel, token);
            currentSubscription.current = channel;

            subscription.on("subscribing", (ctx) => {
                console.log("Subscribing to personal channel:", ctx);
            });

            subscription.on("subscribed", (ctx) => {
                console.log("Subscribed to personal channel:", ctx);
            });

            subscription.on("unsubscribed", (ctx) => {
                console.log("Unsubscribed from personal channel:", ctx);
            });

            subscription.on("error", (ctx) => {
                console.error("Personal subscription error:", ctx);
            });

            subscription.on("publication", (ctx) => {
                console.log("Received personal update:", ctx);
                // Handle personal updates here
            });

            subscription.subscribe();
            console.log("Successfully subscribed to personal channel");
        } catch (error) {
            console.error("Error subscribing to personal channel:", error);
            throw error;
        }
    }, [getSubscriptionToken]);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (currentSubscription.current) {
                console.log("Cleaning up personal subscription for channel:", currentSubscription.current);
                websocketService.unsubscribe(currentSubscription.current);
                currentSubscription.current = null;
            }
        };
    }, []);

    return {
        subscribeToPersonal,
        isSubscribing: getSubscriptionToken.isPending,
        error: getSubscriptionToken.error,
    };
} 