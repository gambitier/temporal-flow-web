"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Sample TradeInfo type (same as in trades/page.tsx)
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

// Helper to build parent/child tree
function buildTradeTree(trades: TradeInfo[], rootId: string) {
  const map: { [id: string]: TradeInfo & { children?: TradeInfo[] } } = {};
  trades.forEach((trade) => {
    map[trade.tradeID] = { ...trade };
  });
  Object.values(map).forEach((trade) => {
    if (trade.parentTradeID && map[trade.parentTradeID]) {
      map[trade.parentTradeID].children =
        map[trade.parentTradeID].children || [];
      map[trade.parentTradeID].children!.push(trade);
    }
  });
  // Return the root trade and its children
  return map[rootId];
}

function TradeDetails({
  trade,
  level = 0,
}: {
  trade: TradeInfo;
  level?: number;
}) {
  const router = useRouter();
  return (
    <div
      className={`relative bg-white rounded-lg shadow p-4 mb-4 border-l-4 ${
        trade.status === "ACTIVE" ? "border-green-500" : "border-gray-300"
      } ${level > 0 ? "ml-8" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              Trade #{trade.tradeID}
            </span>
            {trade.status === "ACTIVE" ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Active
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                Closed
              </span>
            )}
            {trade.parentTradeID && (
              <span className="text-xs text-gray-400">
                (child of {trade.parentTradeID})
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Entry: <b>{trade.entryPrice ?? "-"}</b> at{" "}
            {trade.entryAt ? new Date(trade.entryAt).toLocaleString() : "-"}
            {trade.exitPrice && (
              <>
                {" "}
                | Exit: <b>{trade.exitPrice}</b> at{" "}
                {trade.exitAt ? new Date(trade.exitAt).toLocaleString() : "-"}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-purple-600 hover:underline text-sm px-2 py-1 rounded border border-purple-100 bg-purple-50 hover:bg-purple-100"
            onClick={() =>
              router.push(`/dashboard/trading/logs/${trade.tradeID}`)
            }
          >
            Logs
          </button>
        </div>
      </div>
      {/* Render children recursively */}
      {trade.children &&
        trade.children.map((child) => (
          <TradeDetails key={child.tradeID} trade={child} level={level + 1} />
        ))}
    </div>
  );
}

export default function TradeInfoPage() {
  const params = useParams();
  const { tradeId } = params;
  // Find the root trade and build its tree
  const trade = buildTradeTree(trades, tradeId as string);
  if (!trade) {
    return (
      <div className="py-8 text-center text-gray-500">Trade not found.</div>
    );
  }
  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trade Details</h1>
      <TradeDetails trade={trade} />
      <Link
        href="/dashboard/trading/trades"
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back to Trades
      </Link>
    </div>
  );
}
