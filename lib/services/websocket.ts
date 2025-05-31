import { Centrifuge } from 'centrifuge';

type EventCallback = (ctx: any) => void;

class WebSocketService {
    private centrifuge: Centrifuge | null = null;
    private isConnecting: boolean = false;
    private eventHandlers: Map<string, EventCallback[]> = new Map();

    constructor() {
        // Remove automatic connection from constructor
    }

    public on(event: string, callback: EventCallback) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(callback);
    }

    public off(event: string, callback: EventCallback) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(callback);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    private emit(event: string, ctx: any) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(callback => callback(ctx));
        }
    }

    public async connect() {
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
                this.emit("connecting", ctx);
            });

            this.centrifuge.on("connected", (ctx) => {
                console.log("WebSocket connected:", ctx);
                this.isConnecting = false;
                this.emit("connected", ctx);
            });

            this.centrifuge.on("disconnected", (ctx) => {
                console.log("WebSocket disconnected:", ctx);
                this.isConnecting = false;
                this.emit("disconnected", ctx);
            });

            this.centrifuge.on("error", (error) => {
                console.error("WebSocket error:", error);
                this.isConnecting = false;
                this.emit("error", error);
            });

            this.centrifuge.on("publication", (ctx) => {
                this.emit("publication", ctx);
                console.log("Received publication:", ctx);
            });

            console.log("Connecting to WebSocket...");
            this.centrifuge.connect();
        } catch (error) {
            console.error("Error connecting to WebSocket:", error);
            this.isConnecting = false;
            this.emit("error", error);
        }
    }

    public createSubscription(channel: string, token: string) {
        if (!this.centrifuge) {
            throw new Error("WebSocket not connected");
        }
        return this.centrifuge.newSubscription(channel, { token });
    }

    disconnect() {
        if (this.centrifuge) {
            this.centrifuge.disconnect();
            this.centrifuge = null;
        }
    }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 