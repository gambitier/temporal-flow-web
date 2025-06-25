import { FormStrategyType, CandleDuration } from "@/lib/services/trading";
import { TRADING_STRATEGIES, CANDLE_DURATIONS } from "@/app/types/trading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradingStrategyProps {
  strategy: FormStrategyType;
  candleDuration: CandleDuration;
  quantity: number;
  fundsOnRisk: number;
  onStrategyChange: (value: FormStrategyType) => void;
  onCandleDurationChange: (value: CandleDuration) => void;
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
        <Select
          value={candleDuration.toString()}
          onValueChange={(value) =>
            onCandleDurationChange(Number(value) as CandleDuration)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {CANDLE_DURATIONS.map((duration) => (
              <SelectItem
                key={duration.value}
                value={duration.value.toString()}
              >
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
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            min={1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Funds On Risk:
          </Label>
          <Input
            type="number"
            value={fundsOnRisk}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            min={0}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
