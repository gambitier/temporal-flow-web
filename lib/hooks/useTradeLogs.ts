import { useQuery } from "@tanstack/react-query";
import { fetchTradeLogs, getMockTradeLogs } from "@/lib/services/trading";

export const useTradeLogs = (tradeId: string) => {
    return useQuery({
        queryKey: ["trade-logs", tradeId],
        queryFn: () => {
            // Use mock data in development
            if (process.env.NODE_ENV === "development") {
                return Promise.resolve(getMockTradeLogs(tradeId));
            }
            return fetchTradeLogs(tradeId);
        },
    });
}; 