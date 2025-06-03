import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENTRY_THRESHOLDS, EXIT_THRESHOLDS } from "../types";

interface TradingOptionsProps {
  entryThreshold: string;
  exitThreshold: string;
  tradeType: "long" | "short";
  comparePrevCandle: boolean;
  onEntryThresholdChange: (value: string) => void;
  onExitThresholdChange: (value: string) => void;
  onTradeTypeChange: (value: "long" | "short") => void;
  onComparePrevCandleChange: (checked: boolean) => void;
}

export function TradingOptions({
  entryThreshold,
  exitThreshold,
  tradeType,
  comparePrevCandle,
  onEntryThresholdChange,
  onExitThresholdChange,
  onTradeTypeChange,
  onComparePrevCandleChange,
}: TradingOptionsProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Trading Options
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Entry:
          </Label>
          <Select value={entryThreshold} onValueChange={onEntryThresholdChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select entry" />
            </SelectTrigger>
            <SelectContent>
              {ENTRY_THRESHOLDS.map((threshold) => (
                <SelectItem key={threshold.value} value={threshold.value}>
                  {threshold.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Exit:
          </Label>
          <Select value={exitThreshold} onValueChange={onExitThresholdChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select exit" />
            </SelectTrigger>
            <SelectContent>
              {EXIT_THRESHOLDS.map((threshold) => (
                <SelectItem key={threshold.value} value={threshold.value}>
                  {threshold.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="comparePrevCandle"
            checked={comparePrevCandle}
            onCheckedChange={(checked) =>
              onComparePrevCandleChange(checked as boolean)
            }
          />
          <Label
            htmlFor="comparePrevCandle"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Compare Previous Candle
          </Label>
        </div>

        <RadioGroup
          value={tradeType}
          onValueChange={(value) =>
            onTradeTypeChange(value as "long" | "short")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="long" id="long" />
            <Label
              htmlFor="long"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Going Long
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="short" id="short" />
            <Label
              htmlFor="short"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Going Short
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
