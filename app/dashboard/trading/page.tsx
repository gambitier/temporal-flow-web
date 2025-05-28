"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useWatchlists, useWatchlistSymbols } from "@/lib/hooks/useWatchlists";

type FilterType = "all" | "gainers" | "losers";

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Trading</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedWatchlist}
            onChange={(e) => setSelectedWatchlist(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            disabled={isLoadingWatchlists}
          >
            <option value="">Select a watchlist</option>
            {watchlists.map((watchlist) => (
              <option key={watchlist.id} value={watchlist.id}>
                {watchlist.name}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("gainers")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
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
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
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
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-5 gap-4 mb-4 text-sm font-medium text-gray-500 uppercase">
            <div>Symbol</div>
            <div>Name</div>
            <div className="text-right">Last Price</div>
            <div className="text-right">Change</div>
            <div className="text-right">Change %</div>
          </div>
          <div className="space-y-2">
            {symbols.map((symbol) => (
              <div
                key={symbol.id}
                className="grid grid-cols-5 gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{symbol.symbol}</div>
                <div className="text-gray-500">{symbol.name}</div>
                <div className="text-right text-gray-900">--</div>
                <div className="text-right text-gray-900">--</div>
                <div className="text-right text-gray-900">--</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
