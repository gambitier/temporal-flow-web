import { useMutation } from "@tanstack/react-query";
import { executeTrade, ExecuteTradeRequest, ExecuteTradeResponse } from "@/lib/services/trading";
import { TradingFormData } from "@/app/types/trading";
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

    const executeTradeMutation = (formData: TradingFormData) => {
        const requestData = mapFormDataToRequest(formData);
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
