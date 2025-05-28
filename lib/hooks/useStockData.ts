import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import websocketService from "@/lib/services/websocket";

interface StockData {
    symbol: string;
    lastPrice: number;
    change: number;
    changePercent: number;
}

export function useStockData(symbols: string[]) {
    const queryClient = useQueryClient();

    // Subscribe to WebSocket updates
    useEffect(() => {
        const handleStockData = (data: StockData) => {
            queryClient.setQueryData(["stocks", data.symbol], data);
        };

        // Subscribe to all symbols
        symbols.forEach((symbol) => {
            websocketService.subscribe(symbol, handleStockData);
        });

        // Cleanup subscriptions
        return () => {
            symbols.forEach((symbol) => {
                websocketService.unsubscribe(symbol, handleStockData);
            });
        };
    }, [symbols, queryClient]);

    // Get stock data for all symbols in a single query
    const { data: stockDataQueries, isLoading, error } = useQuery({
        queryKey: ["stocks", ...symbols],
        queryFn: () => {
            // Return cached data for all symbols
            return symbols.reduce<Record<string, StockData | null>>((acc, symbol) => {
                acc[symbol] = queryClient.getQueryData<StockData>(["stocks", symbol]) || null;
                return acc;
            }, {});
        },
        // Enable real-time updates
        refetchInterval: false,
        staleTime: Infinity,
    });

    return {
        stockData: stockDataQueries || {},
        isLoading,
        error,
    };
} 