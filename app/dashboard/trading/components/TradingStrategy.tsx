import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CANDLE_DURATIONS, TRADING_STRATEGIES } from "../types";

interface TradingStrategyProps {
  strategy: string;
  candleDuration: string;
  quantity: number;
  fundsOnRisk: number;
  onStrategyChange: (value: string) => void;
  onCandleDurationChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
}

export function TradingStrategy({
  strategy,
  candleDuration,
  quantity,
  fundsOnRisk,
  onStrategyChange,
  onCandleDurationChange,
  onQuantityChange,
}: TradingStrategyProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Trade Strategy:
        </Label>
        <Select value={strategy} onValueChange={onStrategyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            {TRADING_STRATEGIES.map((strategy) => (
              <SelectItem key={strategy.value} value={strategy.value}>
                {strategy.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          This strategy tracks price movements within a single candle duration.
          The trade will close automatically at candle end.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Candle Duration:
        </Label>
        <Select value={candleDuration} onValueChange={onCandleDurationChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {CANDLE_DURATIONS.map((duration) => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity:
          </Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Funds On Risk:
          </Label>
          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
            <span className="text-sm">{fundsOnRisk.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
