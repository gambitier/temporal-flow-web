"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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

// Helper to flatten the trade tree for DataTable
function flattenTradeTree(trade: TradeInfo): TradeInfo[] {
  const result: TradeInfo[] = [trade];
  if (trade.children) {
    for (const child of trade.children) {
      result.push(...flattenTradeTree(child));
    }
  }
  return result;
}

const columns: ColumnDef<TradeInfo>[] = [
  {
    accessorKey: "tradeID",
    header: "Trade ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/trading/trades/${row.original.tradeID}`}
        className="text-purple-700 hover:underline"
      >
        {row.original.tradeID}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "ACTIVE" ? (
        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-normal">
          Active
        </span>
      ) : (
        <span className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-normal">
          Closed
        </span>
      ),
  },
  {
    accessorKey: "entryPrice",
    header: "Entry Price",
    cell: ({ row }) => row.original.entryPrice ?? "-",
  },
  {
    accessorKey: "exitPrice",
    header: "Exit Price",
    cell: ({ row }) => row.original.exitPrice ?? "-",
  },
  {
    accessorKey: "entryAt",
    header: "Entry At",
    cell: ({ row }) =>
      row.original.entryAt
        ? new Date(row.original.entryAt).toLocaleString()
        : "-",
  },
  {
    accessorKey: "exitAt",
    header: "Exit At",
    cell: ({ row }) =>
      row.original.exitAt
        ? new Date(row.original.exitAt).toLocaleString()
        : "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/trading/trades/${row.original.tradeID}`)
            }
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/trading/logs/${row.original.tradeID}`)
            }
          >
            Logs
          </Button>
        </div>
      );
    },
  },
];

export default function TradeInfoPage() {
  const params = useParams();
  const { tradeId } = params;
  // Find the root trade and build its tree
  const rootTrade = trades.find((t) => t.tradeID === tradeId);
  if (!rootTrade) {
    return (
      <div className="py-8 text-center text-gray-500">Trade not found.</div>
    );
  }
  const flatTrades = flattenTradeTree(rootTrade);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trade Details</h1>
      </div>
      <DataTable
        columns={columns}
        data={flatTrades}
        searchKey="tradeID"
        tableId="trade-details-table"
      />
      <Link
        href="/dashboard/trading/trades"
        className="text-blue-600 hover:underline text-sm mt-4 inline-block"
      >
        ← Back to Trades
      </Link>
    </div>
  );
}
