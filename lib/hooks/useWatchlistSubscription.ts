"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import websocketService from "@/lib/services/websocket";

interface WatchlistSubscriptionToken {
    accessToken: string;
}

interface StockQuote {
    symbol: string;
    name: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    volume: number;
    timestamp: string;
}

export function useWatchlistSubscription() {
    const [currentWatchlistId, setCurrentWatchlistId] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [stockData, setStockData] = useState<StockQuote[]>([]);
    const subscriptionRef = useRef<any>(null);
    const pathname = usePathname();

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

        if (isSubscribing) {
            console.log("Already in process of subscribing");
            return;
        }
        if (currentWatchlistId === watchlistId) {
            console.log("Already subscribing to watchlist:", watchlistId);
            return;
        }

        // If we're already subscribed to this watchlist, no need to resubscribe
        if (currentWatchlistId === watchlistId && subscriptionRef.current) {
            console.log("Already subscribed to watchlist:", watchlistId);
            return;
        }

        try {
            setIsSubscribing(true);

            const channel = `watchlist:${watchlistId}`;
            if (websocketService.isExistingSubscription(channel)) {
                console.log("Subscription already exists for channel:", channel);
                return;
            }

            if (subscriptionRef.current) {
                console.log("Unsubscribing from previous watchlist:", currentWatchlistId);
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            // Get new subscription token
            const token = await getSubscriptionToken.mutateAsync(watchlistId);
            const subscription = websocketService.createSubscription(channel, token);
            subscriptionRef.current = subscription;

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
                // console.log("Received watchlist update for channel:", channel, ctx);
                if (ctx.data && ctx.data.data) {
                    const quotes = ctx.data.data;
                    setStockData((prevData) => {
                        const newData = [...prevData];
                        Object.entries(quotes).forEach(([symbol, quote]: [string, any]) => {
                            const existingIndex = newData.findIndex(
                                (item) => item.symbol === symbol
                            );

                            const LastTradedPrice = quote.LastTradedPrice / 100;
                            const ClosePrice = quote.ClosePrice / 100;
                            const OpenPrice = quote.OpenPrice / 100;
                            const HighPrice = quote.HighPrice / 100;
                            const LowPrice = quote.LowPrice / 100;
                            const VolumeTradedToday = quote.VolumeTradedToday;
                            const stockQuote: StockQuote = {
                                symbol,
                                name: symbol,
                                lastPrice: LastTradedPrice,
                                change: LastTradedPrice - ClosePrice,
                                changePercent: ((LastTradedPrice - ClosePrice) / ClosePrice) * 100,
                                openPrice: OpenPrice,
                                highPrice: HighPrice,
                                lowPrice: LowPrice,
                                closePrice: ClosePrice,
                                volume: VolumeTradedToday,
                                timestamp: new Date(
                                    quote.ExchangeFeedTimeEpochMillis
                                ).toLocaleString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                }),
                            };

                            if (existingIndex >= 0) {
                                newData[existingIndex] = stockQuote;
                            } else {
                                newData.push(stockQuote);
                            }
                        });
                        return newData;
                    });
                }
            });

            subscription.subscribe();
        } catch (error) {
            console.error("Error subscribing to watchlist:", watchlistId, error);
            setIsSubscribing(false);
            if (currentWatchlistId === watchlistId) {
                setCurrentWatchlistId(null);
            }
            throw error;
        }
    }, [currentWatchlistId, getSubscriptionToken, isSubscribing]);

    // Handle route changes
    useEffect(() => {
        const isTradingPage = pathname === '/dashboard/trading';

        if (!isTradingPage && subscriptionRef.current) {
            console.log("Leaving trading page, unsubscribing from watchlist");
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
            setCurrentWatchlistId(null);
        }
    }, [pathname]);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (subscriptionRef.current && currentWatchlistId) {
                console.log("Cleaning up subscription for channel:", `watchlist:${currentWatchlistId}`);
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
                setCurrentWatchlistId(null);
            }
        };
    }, [currentWatchlistId]);

    return {
        subscribeToWatchlist,
        isSubscribing: isSubscribing || getSubscriptionToken.isPending,
        error: getSubscriptionToken.error,
        stockData,
    };
} 