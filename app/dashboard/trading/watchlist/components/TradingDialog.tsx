import {
  useState,
  useCallback,
  memo,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
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
  TradingFormData,
  OHLCData,
  TRADING_STRATEGIES,
  ENTRY_THRESHOLDS,
  EXIT_THRESHOLDS,
  CANDLE_DURATIONS,
} from "@/app/types/trading";
import { TradingStrategy } from "./TradingStrategy";
import { OHLCDataDisplay } from "./OHLCDataDisplay";
import { TradingOptions } from "./TradingOptions";
import { useTrading } from "@/lib/hooks/useTrading";

// Create a context for the dialog state
interface DialogContextType {
  openDialog: (symbol: string, ohlcData?: OHLCData) => void;
  closeDialog: () => void;
  isOpen: boolean;
  currentSymbol: string | null;
  currentOHLCData: OHLCData | undefined;
}

const DialogContext = createContext<DialogContextType | null>(null);

// Provider component
const DialogProvider = memo(function DialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [currentOHLCData, setCurrentOHLCData] = useState<OHLCData | undefined>(
    undefined
  );

  const openDialog = useCallback((symbol: string, ohlcData?: OHLCData) => {
    setCurrentSymbol(symbol);
    setCurrentOHLCData(ohlcData);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setCurrentSymbol(null);
    setCurrentOHLCData(undefined);
  }, []);

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        closeDialog,
        isOpen,
        currentSymbol,
        currentOHLCData,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
});

// Hook to use the dialog context
const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

// Dialog content component
const DialogContentComponent = memo(function DialogContentComponent() {
  const { closeDialog, currentSymbol, currentOHLCData } = useDialog();
  const [formData, setFormData] = useState<TradingFormData>(() => ({
    symbol: currentSymbol || "",
    strategy: TRADING_STRATEGIES[0].value,
    candleDuration: CANDLE_DURATIONS[0].value,
    quantity: 1,
    fundsOnRisk: 0,
    entryThreshold: ENTRY_THRESHOLDS[0].value,
    exitThreshold: EXIT_THRESHOLDS[0].value,
    tradeType: "long",
    comparePrevCandle: false,
  }));

  // Update form data when currentSymbol changes
  useEffect(() => {
    if (currentSymbol) {
      setFormData((prev) => ({
        ...prev,
        symbol: currentSymbol,
      }));
    }
  }, [currentSymbol]);

  const { executeTrade, isLoading } = useTrading();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeTrade(formData, currentOHLCData);
      closeDialog();
    },
    [formData, executeTrade, currentOHLCData, closeDialog]
  );

  const updateFormData = useCallback((updates: Partial<TradingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  if (!currentSymbol) return null;

  return (
    <DialogContent
      className="w-full max-w-lg sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Trade {currentSymbol}
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

        <OHLCDataDisplay data={currentOHLCData} />

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
          disabled={isLoading}
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading
            ? "Executing..."
            : `Go ${formData.tradeType === "long" ? "Long" : "Short"}`}
        </Button>
      </form>
    </DialogContent>
  );
});

// Main dialog component
const TradingDialog = memo(function TradingDialog({
  symbol,
  currentPrice,
  ohlcData,
}: {
  symbol: string;
  currentPrice: number;
  ohlcData?: OHLCData;
}) {
  const { openDialog } = useDialog();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={(e) => {
        e.stopPropagation();
        openDialog(symbol, ohlcData);
      }}
    >
      <Play className="h-4 w-4" />
      Trade
    </Button>
  );
});

// Global dialog component
const GlobalDialog = memo(function GlobalDialog() {
  const { isOpen, closeDialog } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContentComponent />
    </Dialog>
  );
});

export { TradingDialog, DialogProvider, GlobalDialog };
