import { Centrifuge } from 'centrifuge';

class WebSocketService {
    private centrifuge: Centrifuge | null = null;
    private isConnecting: boolean = false;

    constructor() {
        // Remove automatic connection from constructor
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
                    // sample ctx data
                    // {
                    //     "channel": "watchlist:AAAJ084750",
                    //     "data": {
                    //         "event": "ANGEL_ONE_QUOTES",
                    //         "data": {
                    //             "AADHARHFC": {
                    //                 "TokenInfo": {
                    //                     "ExchangeType": 1,
                    //                     "Token": "23729"
                    //                 },
                    //                 "SequenceNumber": 16534003,
                    //                 "ExchangeFeedTimeEpochMillis": 1748428150000,
                    //                 "LastTradedPrice": 43965,
                    //                 "LastTradedQty": 5,
                    //                 "AvgTradedPrice": 44502,
                    //                 "VolumeTradedToday": 364024,
                    //                 "TotalBuyQty": 77,
                    //                 "TotalSellQty": 0,
                    //                 "OpenPrice": 44695,
                    //                 "HighPrice": 45145,
                    //                 "LowPrice": 43830,
                    //                 "ClosePrice": 44505
                    //             }
                    //         }
                    //     },
                    //     "offset": 1
                    // }
                    const data = ctx.data.data;
                    console.log("stock quotes", data);
                }
            });

            console.log("Connecting to WebSocket...");
            this.centrifuge.connect();
        } catch (error) {
            console.error("Error connecting to WebSocket:", error);
            this.isConnecting = false;
        }
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