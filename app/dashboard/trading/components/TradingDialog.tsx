import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface TradingFormData {
  symbol: string;
  strategy: string;
  candleDuration: string;
  quantity: number;
  fundsOnRisk: number;
  entryThreshold: string;
  exitThreshold: string;
  tradeType: "long" | "short";
  comparePrevCandle: boolean;
}

interface TradingDialogProps {
  symbol: string;
  currentPrice: number;
  ohlcData?: {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: string;
  };
}

export function TradingDialog({
  symbol,
  currentPrice,
  ohlcData,
}: TradingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TradingFormData>({
    symbol,
    strategy: "threshold",
    candleDuration: "30",
    quantity: 1,
    fundsOnRisk: 25000,
    entryThreshold: "0",
    exitThreshold: "2",
    tradeType: "long",
    comparePrevCandle: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement trading logic
    console.log("Trading form submitted:", formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Trade {symbol}
          </DialogTitle>
          <DialogDescription>Trading dialog for {symbol}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trade Strategy Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trade Strategy:
              </Label>
              <Select
                value={formData.strategy}
                onValueChange={(value) =>
                  setFormData({ ...formData, strategy: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="threshold">Threshold-based</SelectItem>
                  <SelectItem value="continuouscycle">
                    Continuous Candle Cycle
                  </SelectItem>
                  <SelectItem value="targetpercent">
                    Target-Percentage
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This strategy tracks price movements within a single candle
                duration. The trade will close automatically at candle end.
              </p>
            </div>

            {/* Candle Duration */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Candle Duration:
              </Label>
              <Select
                value={formData.candleDuration}
                onValueChange={(value) =>
                  setFormData({ ...formData, candleDuration: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                  <SelectItem value="1440">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Funds */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity:
                </Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Funds On Risk:
                </Label>
                <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                  <span className="text-sm">
                    {formData.fundsOnRisk.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Previous OHLC Data */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Previous OHLC Data
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {ohlcData?.timestamp || "No data available"}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  Open:
                </Label>
                <div className="text-sm">{ohlcData?.open || "-"}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  High:
                </Label>
                <div className="text-sm">{ohlcData?.high || "-"}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  Low:
                </Label>
                <div className="text-sm">{ohlcData?.low || "-"}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  Close:
                </Label>
                <div className="text-sm">{ohlcData?.close || "-"}</div>
              </div>
            </div>
          </div>

          {/* Trading Options */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trading Options
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Entry:
                </Label>
                <Select
                  value={formData.entryThreshold}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entryThreshold: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select entry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0.0%</SelectItem>
                    <SelectItem value="0.1">0.1%</SelectItem>
                    <SelectItem value="0.3">0.3%</SelectItem>
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="2">2%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exit:
                </Label>
                <Select
                  value={formData.exitThreshold}
                  onValueChange={(value) =>
                    setFormData({ ...formData, exitThreshold: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="2">2%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trade Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comparePrevCandle"
                  checked={formData.comparePrevCandle}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      comparePrevCandle: checked as boolean,
                    })
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
                value={formData.tradeType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    tradeType: value as "long" | "short",
                  })
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

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Go {formData.tradeType === "long" ? "Long" : "Short"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
