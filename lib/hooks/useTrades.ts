import { useQuery } from "@tanstack/react-query";
import { fetchTrades } from "@/lib/services/trading";

export const useTrades = () => {
    return useQuery({
        queryKey: ["trades"],
        queryFn: fetchTrades,
    });
}; 