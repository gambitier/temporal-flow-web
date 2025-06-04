import { FormStrategyType, FormTradeType } from "@/lib/services/trading";

export interface OHLCData {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: string;
}

export interface TradingFormData {
    symbol: string;
    strategy: FormStrategyType;
    candleDuration: string;
    quantity: number;
    fundsOnRisk: number;
    entryThreshold: string;
    exitThreshold: string;
    tradeType: FormTradeType;
    comparePrevCandle: boolean;
}

export const CANDLE_DURATIONS = [
    { value: "5", label: "5 min" },
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "60 min" },
    { value: "120", label: "120 min" },
    { value: "1440", label: "1 day" },
] as const;

export const TRADING_STRATEGIES = [
    { value: "threshold", label: "Threshold-based" },
    { value: "previous_candle", label: "Previous Candle" },
    { value: "continuous_cycle", label: "Continuous Cycle" },
] as const;

export const ENTRY_THRESHOLDS = [
    { value: "0", label: "0.0%" },
    { value: "0.1", label: "0.1%" },
    { value: "0.3", label: "0.3%" },
    { value: "0.5", label: "0.5%" },
    { value: "1", label: "1%" },
    { value: "2", label: "2%" },
] as const;

export const EXIT_THRESHOLDS = [
    { value: "0.5", label: "0.5%" },
    { value: "1", label: "1%" },
    { value: "2", label: "2%" },
] as const; 