import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TradingFormData, OHLCData } from "../types";
import { TradingStrategy } from "./TradingStrategy";
import { OHLCDataDisplay } from "./OHLCDataDisplay";
import { TradingOptions } from "./TradingOptions";

interface TradingDialogProps {
  symbol: string;
  currentPrice: number;
  ohlcData?: OHLCData;
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

  const updateFormData = (updates: Partial<TradingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
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
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TradingStrategy
            strategy={formData.strategy}
            candleDuration={formData.candleDuration}
            quantity={formData.quantity}
            fundsOnRisk={formData.fundsOnRisk}
            onStrategyChange={(value) => updateFormData({ strategy: value })}
            onCandleDurationChange={(value) =>
              updateFormData({ candleDuration: value })
            }
            onQuantityChange={(value) => updateFormData({ quantity: value })}
          />

          <OHLCDataDisplay data={ohlcData} />

          <TradingOptions
            entryThreshold={formData.entryThreshold}
            exitThreshold={formData.exitThreshold}
            tradeType={formData.tradeType}
            comparePrevCandle={formData.comparePrevCandle}
            onEntryThresholdChange={(value) =>
              updateFormData({ entryThreshold: value })
            }
            onExitThresholdChange={(value) =>
              updateFormData({ exitThreshold: value })
            }
            onTradeTypeChange={(value) => updateFormData({ tradeType: value })}
            onComparePrevCandleChange={(checked) =>
              updateFormData({ comparePrevCandle: checked })
            }
          />

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
