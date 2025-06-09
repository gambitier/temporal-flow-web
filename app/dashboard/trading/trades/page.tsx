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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trades</h1>
        {/* Add filters/search here if needed */}
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-border bg-background text-foreground">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Trade ID</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Entry Price</th>
              <th className="px-4 py-3 text-left font-medium">Exit Price</th>
              <th className="px-4 py-3 text-left font-medium">Entry At</th>
              <th className="px-4 py-3 text-left font-medium">Exit At</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.tradeID}
                className={`transition-colors ${
                  trade.status === "ACTIVE"
                    ? "bg-green-50 dark:bg-green-950"
                    : "bg-muted"
                }`}
              >
                <td className="px-4 py-2 text-foreground">
                  <Link
                    href={`/dashboard/trading/trades/${trade.tradeID}`}
                    className="text-purple-700 hover:underline transition"
                  >
                    {trade.tradeID}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground">
                  {trade.status === "ACTIVE" ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-normal">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-normal">
                      Closed
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-foreground font-normal">
                  {trade.entryPrice ?? "-"}
                </td>
                <td className="px-4 py-2 text-foreground font-normal">
                  {trade.exitPrice ?? "-"}
                </td>
                <td className="px-4 py-2 text-foreground font-normal">
                  {trade.entryAt
                    ? new Date(trade.entryAt).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2 text-foreground font-normal">
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
      <p className="text-muted-foreground text-sm">
        Click a Trade ID, row, or "View" to see trade details. "Logs" opens the
        trade's logs. Status is color-coded.
      </p>
    </div>
  );
}
