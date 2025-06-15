import { TradingFormData, OHLCData } from "@/app/types/trading";

export type TradeType = "LONG" | "SHORT";
export type StrategyType = "BREAKOUT" | "PREVIOUS_CANDLE" | "CONTINUOUS_CYCLE";
export type FormStrategyType = "threshold" | "previous_candle" | "continuous_cycle";
export type FormTradeType = "long" | "short";
export type CandleDuration = 5 | 15 | 30 | 60 | 120 | 1440;

export interface ExecuteTradeRequest {
    symbol: string;
    tradeType: TradeType;
    strategyType: StrategyType;
    entryThreshold: number;
    exitThreshold: number;
    quantity: number;
    candleDuration: CandleDuration;
    requestedExecutionPrice: number;
    comparePrevCandle: boolean;
}

export interface ExecuteTradeResponse {
    success: boolean;
    message: string;
    tradeId?: string;
}

export interface Trade {
    id: string;
    parentTradeID: string | null;
    userID: string;
    brokerID: string;
    symbol: string;
    order: {
        symbol: string;
        tradeType: TradeType;
        strategyType: StrategyType;
        quantity: number;
        comparePrevCandle: boolean;
        isRecurring: boolean;
        candleDuration: CandleDuration;
        requestedExecutionPrice: number;
        entryThreshold: number;
        exitThreshold: number;
        createdAt: string;
    } | null;
    entryPrice: number | null;
    exitPrice: number | null;
    entryAt: string | null;
    exitAt: string | null;
    status: "PENDING" | "ACTIVE" | "CLOSED";
    createdAt: string;
    updatedAt: string;
}

export interface TradeLog {
    id: string;
    tradeID: string;
    message: string;
    metadata: {
        tradeID: string;
        parentTradeID: string | null;
        userID: string;
        brokerID: string;
        order: {
            symbol: string;
            tradeType: TradeType;
            strategyType: StrategyType;
            quantity: number;
            comparePrevCandle: boolean;
            isRecurring: boolean;
            candleDuration: CandleDuration;
            requestedExecutionPrice: number;
            entryThreshold: number;
            exitThreshold: number;
            createdAt: string;
        } | null;
        status: "PENDING" | "ACTIVE" | "CLOSED";
        entryPrice: number | null;
        exitPrice: number | null;
        entryAt: string | null;
        exitAt: string | null;
    };
    createdAt: string;
}

const API_BASE_URL = "http://localhost:8085/api/v1";

export const executeTrade = async (data: ExecuteTradeRequest): Promise<ExecuteTradeResponse> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_BASE_URL}/trading/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to execute trade");
    }

    return response.json();
};

//TODO: use LTP instead of ohlcData
export const mapFormDataToRequest = (formData: TradingFormData, ohlcData?: OHLCData): ExecuteTradeRequest => {
    const request: ExecuteTradeRequest = {
        symbol: formData.symbol,
        tradeType: formData.tradeType.toUpperCase() as TradeType,
        strategyType: mapStrategyType(formData.strategy),
        entryThreshold: parseFloat(formData.entryThreshold),
        exitThreshold: parseFloat(formData.exitThreshold),
        quantity: formData.quantity,
        candleDuration: formData.candleDuration,
        comparePrevCandle: formData.comparePrevCandle,
        requestedExecutionPrice: ohlcData?.close || 0, //TODO: use LTP
    };



    return request;
};

const mapStrategyType = (strategy: FormStrategyType): StrategyType => {
    switch (strategy) {
        case "threshold":
            return "BREAKOUT";
        case "previous_candle":
            return "PREVIOUS_CANDLE";
        case "continuous_cycle":
            return "CONTINUOUS_CYCLE";
        default:
            throw new Error(`Invalid strategy type: ${strategy}`);
    }
};

export const fetchTrades = async (): Promise<Trade[]> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_BASE_URL}/trades`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch trades");
    }

    return response.json();
};

export const fetchTradeDetails = async (tradeId: string): Promise<Trade[]> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_BASE_URL}/trades/${tradeId}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch trade details");
    }

    return response.json();
};

export const fetchTradeLogs = async (tradeId: string): Promise<TradeLog[]> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_BASE_URL}/trades/${tradeId}/logs`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch trade logs");
    }

    return response.json();
};

export const getMockTradeLogs = (tradeId: string): TradeLog[] => {
    return [
        {
            id: "1",
            tradeID: tradeId,
            message: "Trade order created",
            metadata: {
                tradeID: tradeId,
                parentTradeID: null,
                userID: "user-123",
                brokerID: "broker-456",
                order: {
                    symbol: "RELIANCE",
                    tradeType: "LONG",
                    strategyType: "BREAKOUT",
                    quantity: 10,
                    comparePrevCandle: false,
                    isRecurring: true,
                    candleDuration: 5,
                    requestedExecutionPrice: 2418.5,
                    entryThreshold: 0.5,
                    exitThreshold: 1.0,
                    createdAt: new Date().toISOString()
                },
                status: "PENDING",
                entryPrice: null,
                exitPrice: null,
                entryAt: null,
                exitAt: null
            },
            createdAt: new Date().toISOString()
        },
        {
            id: "2",
            tradeID: tradeId,
            message: "Order placed in market",
            metadata: {
                tradeID: tradeId,
                parentTradeID: null,
                userID: "user-123",
                brokerID: "broker-456",
                order: {
                    symbol: "RELIANCE",
                    tradeType: "LONG",
                    strategyType: "BREAKOUT",
                    quantity: 10,
                    comparePrevCandle: false,
                    isRecurring: true,
                    candleDuration: 5,
                    requestedExecutionPrice: 2418.5,
                    entryThreshold: 0.5,
                    exitThreshold: 1.0,
                    createdAt: new Date().toISOString()
                },
                status: "ACTIVE",
                entryPrice: 2418.5,
                exitPrice: null,
                entryAt: new Date().toISOString(),
                exitAt: null
            },
            createdAt: new Date(Date.now() + 1000).toISOString()
        },
        {
            id: "3",
            tradeID: tradeId,
            message: "Price target reached, initiating exit",
            metadata: {
                tradeID: tradeId,
                parentTradeID: null,
                userID: "user-123",
                brokerID: "broker-456",
                order: {
                    symbol: "RELIANCE",
                    tradeType: "LONG",
                    strategyType: "BREAKOUT",
                    quantity: 10,
                    comparePrevCandle: false,
                    isRecurring: true,
                    candleDuration: 5,
                    requestedExecutionPrice: 2418.5,
                    entryThreshold: 0.5,
                    exitThreshold: 1.0,
                    createdAt: new Date().toISOString()
                },
                status: "ACTIVE",
                entryPrice: 2418.5,
                exitPrice: 2442.68,
                entryAt: new Date().toISOString(),
                exitAt: new Date(Date.now() + 2000).toISOString()
            },
            createdAt: new Date(Date.now() + 2000).toISOString()
        },
        {
            id: "4",
            tradeID: tradeId,
            message: "Trade completed successfully",
            metadata: {
                tradeID: tradeId,
                parentTradeID: null,
                userID: "user-123",
                brokerID: "broker-456",
                order: {
                    symbol: "RELIANCE",
                    tradeType: "LONG",
                    strategyType: "BREAKOUT",
                    quantity: 10,
                    comparePrevCandle: false,
                    isRecurring: true,
                    candleDuration: 5,
                    requestedExecutionPrice: 2418.5,
                    entryThreshold: 0.5,
                    exitThreshold: 1.0,
                    createdAt: new Date().toISOString()
                },
                status: "CLOSED",
                entryPrice: 2418.5,
                exitPrice: 2442.68,
                entryAt: new Date().toISOString(),
                exitAt: new Date(Date.now() + 3000).toISOString()
            },
            createdAt: new Date(Date.now() + 3000).toISOString()
        }
    ];
}; 