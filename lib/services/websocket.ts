import { Centrifuge } from 'centrifuge';

interface StockData {
    symbol: string;
    lastPrice: number;
    change: number;
    changePercent: number;
}

type StockDataCallback = (data: StockData) => void;

class WebSocketService {
    private centrifuge: Centrifuge | null = null;
    private subscribers: Map<string, Set<StockDataCallback>> = new Map();
    private isConnecting: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.connect();
        }
    }

    private async connect() {
        if (this.isConnecting || this.centrifuge) return;

        try {
            this.isConnecting = true;
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            console.log("Fetching WebSocket info...");
            const response = await fetch("http://localhost:8085/api/v1/ws/info", {
                headers: {
                    "Authorization": token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to get connection info");
            }

            const info = await response.json();
            console.log("WebSocket info:", info);

            if (!info.ws_url) {
                throw new Error("WebSocket URL not provided in server response");
            }

            console.log("Fetching subscription token...");
            const subscriptionTokenResponse = await fetch(
                "http://localhost:8085/api/v1/ws/token/subscription",
                {
                    headers: {
                        "Authorization": token,
                    },
                }
            );

            if (!subscriptionTokenResponse.ok) {
                throw new Error("Failed to get subscription token");
            }

            const subscriptionTokenData = await subscriptionTokenResponse.json();
            const subscriptionToken = subscriptionTokenData.accessToken;
            console.log("Subscription token:", subscriptionToken);

            const wsUrl = info.ws_url;
            console.log("WebSocket URL:", wsUrl);

            this.centrifuge = new Centrifuge(wsUrl, {
                token: subscriptionToken,
                minReconnectDelay: 1000,
                maxReconnectDelay: 10000,
                maxServerPingDelay: 10000,
                debug: true,
            });


            this.centrifuge.on("connecting", (ctx) => {
                console.log("WebSocket connecting:", ctx);
            });

            this.centrifuge.on("connected", (ctx) => {
                console.log("WebSocket connected:", ctx);
                this.isConnecting = false;
            });

            this.centrifuge.on("disconnected", (ctx) => {
                console.log("WebSocket disconnected:", ctx);
                this.isConnecting = false;
            });

            this.centrifuge.on("error", (error) => {
                console.error("WebSocket error:", error);
                this.isConnecting = false;
            });

            this.centrifuge.on("publication", (ctx) => {
                console.log("Received publication:", ctx);
                const channel = ctx.channel;
                if (channel.includes("watchlist")) {
                    const data = ctx.data.data;
                    Object.entries(data).forEach(([symbol, stockData]) => {
                        const callbacks = this.subscribers.get(symbol);
                        if (callbacks) {
                            callbacks.forEach((callback) => callback(stockData as StockData));
                        }
                    });
                }
            });

            console.log("Connecting to WebSocket...");
            this.centrifuge.connect();
        } catch (error) {
            console.error("Error connecting to WebSocket:", error);
            this.isConnecting = false;
        }
    }

    subscribe(symbol: string, callback: StockDataCallback) {
        if (!this.subscribers.has(symbol)) {
            this.subscribers.set(symbol, new Set());
        }
        this.subscribers.get(symbol)!.add(callback);
    }

    unsubscribe(symbol: string, callback: StockDataCallback) {
        const callbacks = this.subscribers.get(symbol);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.subscribers.delete(symbol);
            }
        }
    }

    disconnect() {
        if (this.centrifuge) {
            this.centrifuge.disconnect();
            this.centrifuge = null;
        }
        this.subscribers.clear();
    }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 