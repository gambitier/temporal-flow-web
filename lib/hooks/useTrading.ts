import { useMutation } from "@tanstack/react-query";
import { executeTrade, ExecuteTradeRequest, ExecuteTradeResponse } from "@/lib/services/trading";
import { TradingFormData, OHLCData } from "@/app/types/trading";
import { mapFormDataToRequest } from "@/lib/services/trading";
import { toast } from "sonner";

export const useTrading = () => {
    const mutation = useMutation<ExecuteTradeResponse, Error, ExecuteTradeRequest>({
        mutationFn: executeTrade,
        onSuccess: (data) => {
            toast.success(data.message || "Trade executed successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to execute trade");
        },
    });

    const executeTradeMutation = (formData: TradingFormData, ohlcData?: OHLCData) => {
        const requestData = mapFormDataToRequest(formData, ohlcData);
        return mutation.mutate(requestData);
    };

    return {
        executeTrade: executeTradeMutation,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};
