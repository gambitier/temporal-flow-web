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

function TradeTableRow({
  trade,
  router,
}: {
  trade: TradeInfo;
  router: ReturnType<typeof useRouter>;
}) {
  const rowColor =
    trade.status === "ACTIVE"
      ? "bg-green-50 hover:bg-green-100"
      : "bg-gray-50 hover:bg-gray-100";
  return (
    <>
      <tr className={`transition-colors ${rowColor}`}>
        <td className="px-4 py-2 font-semibold text-purple-700 underline">
          {trade.tradeID}
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
          {trade.entryAt ? new Date(trade.entryAt).toLocaleString() : "-"}
        </td>
        <td className="px-4 py-2">
          {trade.exitAt ? new Date(trade.exitAt).toLocaleString() : "-"}
        </td>
        <td className="px-4 py-2 flex gap-2">
          <button
            className="text-purple-600 hover:underline text-sm px-2 py-1 rounded border border-purple-100 bg-purple-50 hover:bg-purple-100"
            onClick={() =>
              router.push(`/dashboard/trading/logs/${trade.tradeID}`)
            }
          >
            Logs
          </button>
        </td>
      </tr>
      {trade.children &&
        trade.children.map((child) => (
          <TradeTableRow key={child.tradeID} trade={child} router={router} />
        ))}
    </>
  );
}

export default function TradeInfoPage() {
  const params = useParams();
  const router = useRouter();
  const { tradeId } = params;
  // Find the root trade and build its tree
  const trade = buildTradeTree(trades, tradeId as string);
  if (!trade) {
    return (
      <div className="py-8 text-center text-gray-500">Trade not found.</div>
    );
  }
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trade Details</h1>
      <table className="min-w-full border border-gray-200 bg-white rounded-md overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Trade ID</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Entry Price</th>
            <th className="px-4 py-2 text-left">Exit Price</th>
            <th className="px-4 py-2 text-left">Entry At</th>
            <th className="px-4 py-2 text-left">Exit At</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <TradeTableRow trade={trade} router={router} />
        </tbody>
      </table>
      <Link
        href="/dashboard/trading/trades"
        className="text-blue-600 hover:underline text-sm mt-4 inline-block"
      >
        ← Back to Trades
      </Link>
    </div>
  );
}
