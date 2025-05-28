"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { useWatchlists, useWatchlistSymbols } from "@/lib/hooks/useWatchlists";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "gainers" | "losers";

interface Symbol {
  id: string;
  symbol: string;
  name: string;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
}

const columns: ColumnDef<Symbol>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: () => "--",
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: () => "--",
  },
  {
    accessorKey: "changePercent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Change %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: () => "--",
  },
];

export default function TradingPage() {
  const { user } = useAuth();
  const [selectedWatchlist, setSelectedWatchlist] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Fetch watchlists
  const { watchlists, isLoading: isLoadingWatchlists } = useWatchlists();

  // Set initial watchlist when data is loaded
  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlist) {
      // Setting initial watchlist
      setSelectedWatchlist(watchlists[0].id);
    }
  }, [watchlists]);

  // Fetch symbols for selected watchlist
  const { symbols, isLoading: isLoadingSymbols } =
    useWatchlistSymbols(selectedWatchlist);

  const isLoading = isLoadingWatchlists || isLoadingSymbols;

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
        <h1 className="text-2xl font-semibold text-gray-900 flex-shrink-0">
          Trading
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            value={selectedWatchlist}
            onChange={(e) => setSelectedWatchlist(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm w-full sm:w-auto"
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
              className={`px-3 py-1 rounded-md text-sm font-medium w-full sm:w-auto ${
                filter === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("gainers")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center w-full sm:w-auto ${
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
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center w-full sm:w-auto ${
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
        <DataTable columns={columns} data={symbols} searchKey="symbol" />
      )}
    </div>
  );
}
