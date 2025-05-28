"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useWatchlists, useWatchlistSymbols } from "@/lib/hooks/useWatchlists";
import { useStockData } from "@/lib/hooks/useStockData";

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

  // Get real-time stock data
  const { stockData, isLoading: isLoadingStockData } = useStockData(
    symbols.map((symbol) => symbol.symbol)
  );

  const isLoading =
    isLoadingWatchlists || isLoadingSymbols || isLoadingStockData;

  const filteredSymbols = symbols.filter((symbol) => {
    const data = stockData[symbol.symbol];
    if (!data) return true;

    switch (filter) {
      case "gainers":
        return data.change > 0;
      case "losers":
        return data.change < 0;
      default:
        return true;
    }
  });

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

      {isLoadingSymbols || isLoadingStockData ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSymbols.map((symbol) => {
                const data = stockData[symbol.symbol];
                return (
                  <tr key={symbol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {symbol.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {symbol.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {data?.lastPrice?.toFixed(2) || "--"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                        data?.change && data.change > 0
                          ? "text-green-600"
                          : data?.change && data.change < 0
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {data?.change?.toFixed(2) || "--"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                        data?.changePercent && data.changePercent > 0
                          ? "text-green-600"
                          : data?.changePercent && data.changePercent < 0
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {data?.changePercent
                        ? `${data.changePercent.toFixed(2)}%`
                        : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
