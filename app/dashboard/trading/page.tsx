"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useWatchlists, useWatchlistSymbols } from "@/lib/hooks/useWatchlists";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import websocketService from "@/lib/services/websocket";
import { useWebSocket } from "@/lib/contexts/WebSocketContext";

type FilterType = "all" | "gainers" | "losers";

interface StockQuote {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  timestamp: string;
}

interface WebSocketContext {
  channel: string;
  data: {
    event: string;
    data: {
      [key: string]: {
        TokenInfo: {
          ExchangeType: number;
          Token: string;
        };
        SequenceNumber: number;
        ExchangeFeedTimeEpochMillis: number;
        LastTradedPrice: number;
        LastTradedQty: number;
        AvgTradedPrice: number;
        VolumeTradedToday: number;
        TotalBuyQty: number;
        TotalSellQty: number;
        OpenPrice: number;
        HighPrice: number;
        LowPrice: number;
        ClosePrice: number;
      };
    };
  };
  offset: number;
}

const columns: ColumnDef<StockQuote>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    id: "chart",
    header: "Chart",
    cell: () => (
      <Button variant="ghost" size="sm">
        <TrendingUp className="h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: () => (
      <Button variant="ghost" size="sm">
        Trade
      </Button>
    ),
  },
  {
    accessorKey: "lastPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          LTP
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("lastPrice") as number;
      return value ? `${value.toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "change",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Change
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("change") as number;
      const formattedValue = value ? `${value.toFixed(2)}` : "--";
      return (
        <div className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {formattedValue}
        </div>
      );
    },
  },
  {
    accessorKey: "changePercent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Change (%)
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("changePercent") as number;
      const formattedValue = value ? `${value.toFixed(2)}%` : "--";
      return (
        <div className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {formattedValue}
        </div>
      );
    },
  },
  {
    accessorKey: "openPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Open
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("openPrice") as number;
      return value ? `${value.toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "highPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          High
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("highPrice") as number;
      return value ? `${value.toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "lowPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Low
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("lowPrice") as number;
      return value ? `${value.toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "closePrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Close
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("closePrice") as number;
      return value ? `${value.toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("volume") as number;
      return value ? value.toLocaleString() : "--";
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated On
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("timestamp") as string;
      return value ? new Date(value).toLocaleString() : "--";
    },
  },
];

export default function TradingPage() {
  const { user } = useAuth();
  const [selectedWatchlist, setSelectedWatchlist] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [stockData, setStockData] = useState<StockQuote[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [mounted, setMounted] = useState(false);
  const { isConnected, isConnecting, error } = useWebSocket();

  // Handle initial sorting state after mount
  useEffect(() => {
    const saved = localStorage.getItem("trading-table-sorting");
    if (saved) {
      try {
        setSorting(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved sorting state:", e);
      }
    }
    setMounted(true);
  }, []);

  // Save sorting state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("trading-table-sorting", JSON.stringify(sorting));
    }
  }, [sorting, mounted]);

  // Filter stocks based on selected filter
  const filteredStocks = stockData.filter((stock) => {
    switch (filter) {
      case "gainers":
        return stock.changePercent > 0;
      case "losers":
        return stock.changePercent < 0;
      default:
        return true;
    }
  });

  // Fetch watchlists
  const { watchlists, isLoading: isLoadingWatchlists } = useWatchlists();

  // Set initial watchlist when data is loaded
  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(watchlists[0].id);
    }
  }, [watchlists]);

  // Fetch symbols for selected watchlist
  const { symbols, isLoading: isLoadingSymbols } =
    useWatchlistSymbols(selectedWatchlist);

  // Handle WebSocket updates
  useEffect(() => {
    if (!mounted || !isConnected) return;

    const handleStockUpdate = (data: any) => {
      setStockData((prevData) => {
        const newData = [...prevData];
        Object.entries(data).forEach(([symbol, quote]: [string, any]) => {
          const existingIndex = newData.findIndex(
            (item) => item.symbol === symbol
          );

          const LastTradedPrice = quote.LastTradedPrice / 100;
          const ClosePrice = quote.ClosePrice / 100;
          const OpenPrice = quote.OpenPrice / 100;
          const HighPrice = quote.HighPrice / 100;
          const LowPrice = quote.LowPrice / 100;
          const VolumeTradedToday = quote.VolumeTradedToday;
          const stockQuote: StockQuote = {
            symbol,
            name: symbol,
            lastPrice: LastTradedPrice,
            change: LastTradedPrice - ClosePrice,
            changePercent: ((LastTradedPrice - ClosePrice) / ClosePrice) * 100,
            openPrice: OpenPrice,
            highPrice: HighPrice,
            lowPrice: LowPrice,
            closePrice: ClosePrice,
            volume: VolumeTradedToday,
            timestamp: new Date(
              quote.ExchangeFeedTimeEpochMillis
            ).toISOString(),
          };

          if (existingIndex >= 0) {
            newData[existingIndex] = stockQuote;
          } else {
            newData.push(stockQuote);
          }
        });
        return newData;
      });
    };

    // Subscribe to WebSocket updates
    const handlePublication = (ctx: WebSocketContext) => {
      if (ctx.channel.includes("watchlist")) {
        handleStockUpdate(ctx.data.data);
      }
    };

    websocketService.on("publication", handlePublication);

    return () => {
      // Cleanup subscription
      websocketService.off("publication", handlePublication);
    };
  }, [mounted, isConnected]);

  const isLoading = isLoadingWatchlists || isLoadingSymbols;

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  if (isLoadingWatchlists) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Responsive header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trading</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            value={selectedWatchlist}
            onChange={(e) => setSelectedWatchlist(e.target.value)}
            className="body2 rounded-md border border-input bg-card text-foreground shadow-sm focus:border-purple-500 focus:ring-purple-500 w-full sm:w-auto dark:bg-gray-900 dark:text-white dark:border-gray-700"
            disabled={isLoadingWatchlists}
          >
            <option value="">Select a watchlist</option>
            {watchlists.map((watchlist) => (
              <option key={watchlist.id} value={watchlist.id}>
                {watchlist.name}
              </option>
            ))}
          </select>
          <div className="flex flex-row flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`body2 px-3 py-1 rounded-md font-medium w-full sm:w-auto ${
                filter === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("gainers")}
              className={`body2 px-3 py-1 rounded-md font-medium flex items-center w-full sm:w-auto ${
                filter === "gainers"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Gainers
            </button>
            <button
              onClick={() => setFilter("losers")}
              className={`body2 px-3 py-1 rounded-md font-medium flex items-center w-full sm:w-auto ${
                filter === "losers"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Losers
            </button>
          </div>
        </div>
      </div>

      {isLoadingSymbols ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredStocks}
          searchKey="symbol"
          tableId="trading-table"
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}
    </div>
  );
}
