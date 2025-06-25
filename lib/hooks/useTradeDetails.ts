import { useQuery } from "@tanstack/react-query";
import { fetchTradeDetails } from "@/lib/services/trading";

export const useTradeDetails = (tradeId: string) => {
    return useQuery({
        queryKey: ["trade", tradeId],
        queryFn: () => fetchTradeDetails(tradeId),
    });
}; 