import { useQuery } from "@tanstack/react-query";

export function useWebsocketSubscriptionToken(channel: "personal" | "watchlist", watchlistId?: string) {
    return useQuery({
        queryKey: ["websocket-subscription-token", channel, watchlistId],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");
            const res = await fetch(
                `http://localhost:8085/api/v1/ws/token/subscription/${channel}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: channel === "watchlist" ? JSON.stringify({ watchlistId }) : JSON.stringify({}),
                }
            );
            if (!res.ok) throw new Error("Failed to get subscription token");
            return res.json();
        },
        enabled: channel === "personal" || (!!watchlistId && channel === "watchlist"),
    });
} 