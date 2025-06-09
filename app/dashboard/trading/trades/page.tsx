"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Sample TradeInfo type (simplified for demo)
type TradeInfo = {
  tradeID: string;
  parentTradeID?: string | null;
  status: "ACTIVE" | "CLOSED";
  entryPrice?: number;
  exitPrice?: number;
  entryAt?: string;
  exitAt?: string;
  children?: TradeInfo[];
};

// Mock trades data (with parent/child relationship)
const trades: TradeInfo[] = [
  {
    tradeID: "1",
    status: "ACTIVE",
    entryPrice: 100,
    entryAt: "2024-06-10T10:00:00Z",
    parentTradeID: null,
  },
  {
    tradeID: "2",
    status: "CLOSED",
    entryPrice: 120,
    exitPrice: 130,
    entryAt: "2024-06-09T09:00:00Z",
    exitAt: "2024-06-09T10:00:00Z",
    parentTradeID: null,
  },
  {
    tradeID: "3",
    status: "ACTIVE",
    entryPrice: 105,
    entryAt: "2024-06-10T10:30:00Z",
    parentTradeID: "1",
  },
  {
    tradeID: "4",
    status: "CLOSED",
    entryPrice: 110,
    exitPrice: 115,
    entryAt: "2024-06-09T11:00:00Z",
    exitAt: "2024-06-09T12:00:00Z",
    parentTradeID: "2",
  },
];

export default function TradesPage() {
  const router = useRouter();
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trades</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Trade ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Entry Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Exit Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Entry At
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Exit At
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.tradeID}
                className={`transition-colors ${
                  trade.status === "ACTIVE"
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <td className="px-4 py-2 font-semibold text-purple-700 underline">
                  <Link href={`/dashboard/trading/trades/${trade.tradeID}`}>
                    {trade.tradeID}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  {trade.status === "ACTIVE" ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      Closed
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{trade.entryPrice ?? "-"}</td>
                <td className="px-4 py-2">{trade.exitPrice ?? "-"}</td>
                <td className="px-4 py-2">
                  {trade.entryAt
                    ? new Date(trade.entryAt).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {trade.exitAt ? new Date(trade.exitAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/trading/trades/${trade.tradeID}`)
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/trading/logs/${trade.tradeID}`)
                    }
                  >
                    Logs
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-500 text-sm">
        Click a Trade ID, row, or "View" to see trade details. "Logs" opens the
        trade's logs. Status is color-coded.
      </p>
    </div>
  );
}
