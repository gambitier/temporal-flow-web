"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import websocketService from "@/lib/services/websocket";
import { jwtDecode } from "jwt-decode";

interface PersonalSubscriptionToken {
    accessToken: string;
}

interface JwtPayload {
    sub: string;
}

export function usePersonalSubscription() {
    const getSubscriptionToken = useMutation({
        mutationFn: async () => {
            const personalChannel = "personal";
            const token = localStorage.getItem("accessToken");
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

            if (!data.accessToken) {
                throw new Error("No token in personal subscription response");
            }

            return data.accessToken;
        },
    });

    const subscribeToPersonal = useCallback(async () => {
        try {
            console.log("Subscribing to personal channel");

            // Get new subscription token
            const token = await getSubscriptionToken.mutateAsync();

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
            if (websocketService.isExistingSubscription(channel)) {
                console.log("Subscription already exists for channel:", channel);
                return;
            }

            const subscription = websocketService.createSubscription(channel, token);

            subscription.on("subscribing", (ctx: any) => {
                console.log("Subscribing to personal channel:", ctx);
            });

            subscription.on("subscribed", (ctx: any) => {
                console.log("Subscribed to personal channel:", ctx);
            });

            subscription.on("unsubscribed", (ctx: any) => {
                console.log("Unsubscribed from personal channel:", ctx);
            });

            subscription.on("error", (ctx: any) => {
                console.error("Personal subscription error:", ctx);
            });

            subscription.on("publication", (ctx: any) => {
                console.log("Received personal update:", ctx);
                // Handle personal updates here
            });

            subscription.subscribe();
        } catch (error) {
            console.error("Error subscribing to personal channel:", error);
            throw error;
        }
    }, [getSubscriptionToken]);

    return {
        subscribeToPersonal,
        isSubscribing: getSubscriptionToken.isPending,
        error: getSubscriptionToken.error,
    };
} 