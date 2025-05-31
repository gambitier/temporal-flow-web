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

    public connect(wsUrl: string, subscriptionToken: string) {
        if (this.isConnecting || this.centrifuge) return;

        try {
            this.isConnecting = true;
            console.log("Connecting to WebSocket...", wsUrl);

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

            this.centrifuge.connect();
        } catch (error) {
            console.error("Error connecting to WebSocket:", error);
            this.isConnecting = false;
            this.emit("error", error);
        }
    }

    public isExistingSubscription(channel: string) {
        if (!this.centrifuge) {
            throw new Error("WebSocket not connected");
        }
        const existingSubscription = this.centrifuge.getSubscription(channel);
        return existingSubscription !== null;
    }

    public createSubscription(channel: string, token: string) {
        if (!this.centrifuge) {
            throw new Error("WebSocket not connected");
        }
        if (token === "" || token === null || token === undefined) {
            throw new Error(`Error creating subscription for channel: ${channel} | Error: Token is empty or undefined or null`);
        }

        if (this.isExistingSubscription(channel)) {
            throw new Error(`Subscription already exists for channel: ${channel}`);
        }

        const subscription = this.centrifuge.newSubscription(channel, {
            token,
            recoverable: true,
            positioned: true
        });

        return subscription;
    }

    disconnect() {
        if (this.centrifuge) {
            console.log("Disconnecting WebSocket");
            this.centrifuge.disconnect();
            this.centrifuge = null;
        }
    }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 