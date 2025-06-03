import { Label } from "@/components/ui/label";
import { OHLCData } from "../types";

interface OHLCDataDisplayProps {
  data?: OHLCData;
}

export function OHLCDataDisplay({ data }: OHLCDataDisplayProps) {
  if (!data) return null;

  return (
    <div className="space-y-2 border-t pt-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Previous OHLC Data
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {data.timestamp}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500 dark:text-gray-400">
            Open:
          </Label>
          <div className="text-sm">{data.open}</div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-500 dark:text-gray-400">
            High:
          </Label>
          <div className="text-sm">{data.high}</div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-500 dark:text-gray-400">
            Low:
          </Label>
          <div className="text-sm">{data.low}</div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-500 dark:text-gray-400">
            Close:
          </Label>
          <div className="text-sm">{data.close}</div>
        </div>
      </div>
    </div>
  );
}
