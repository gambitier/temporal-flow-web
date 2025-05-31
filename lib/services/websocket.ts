import { Centrifuge, Subscription } from 'centrifuge';

type EventCallback = (ctx: any) => void;

class WebSocketService {
    private centrifuge: Centrifuge | null = null;
    private isConnecting: boolean = false;
    private eventHandlers: Map<string, EventCallback[]> = new Map();
    private subscriptions: Map<string, Subscription> = new Map();

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

    public createSubscription(channel: string, token: string) {
        if (!this.centrifuge) {
            throw new Error("WebSocket not connected");
        }
        if (token === "" || token === null || token === undefined) {
            throw new Error(`Error creating subscription for channel: ${channel} | Error: Token is empty or undefined or null`);
        }

        // Check if subscription already exists
        if (this.subscriptions.has(channel)) {
            console.log("Subscription already exists for channel:", channel);
            // Instead of returning the existing subscription, unsubscribe and create a new one
            this.unsubscribe(channel);
        }

        console.log("existing subscriptions:", this.subscriptions);

        const subscription = this.centrifuge.newSubscription(channel, {
            token,
            recoverable: true,
            positioned: true
        });

        // Add event handlers to track subscription state
        subscription.on("subscribing", (ctx) => {
            console.log("Subscribing to channel:", channel, ctx);
        });

        subscription.on("subscribed", (ctx) => {
            console.log("Subscribed to channel:", channel, ctx);
        });

        subscription.on("unsubscribed", (ctx) => {
            console.log("Unsubscribed from channel:", channel, ctx);
            // Remove from subscriptions map when unsubscribed
            this.subscriptions.delete(channel);
        });

        subscription.on("error", (error) => {
            console.error("Subscription error for channel:", channel, error);
            // Remove from subscriptions map on error
            this.subscriptions.delete(channel);
        });

        this.subscriptions.set(channel, subscription);
        return subscription;
    }

    public unsubscribe(channel: string) {
        const subscription = this.subscriptions.get(channel);
        if (subscription) {
            console.log("Unsubscribing from channel:", channel);
            subscription.unsubscribe();
            // Remove from subscriptions map immediately
            this.subscriptions.delete(channel);
        }
    }

    disconnect() {
        if (this.centrifuge) {
            console.log("Disconnecting WebSocket");
            // Unsubscribe from all channels first
            this.subscriptions.forEach((subscription, channel) => {
                console.log("Unsubscribing from channel before disconnect:", channel);
                subscription.unsubscribe();
            });
            this.subscriptions.clear();
            this.centrifuge.disconnect();
            this.centrifuge = null;
        }
    }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 