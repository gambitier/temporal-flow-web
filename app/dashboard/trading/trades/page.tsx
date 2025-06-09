"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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

export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trades</h1>
      </div>
      <DataTable
        columns={columns}
        data={trades}
        searchKey="tradeID"
        tableId="trades-table"
      />
      <p className="text-muted-foreground text-sm">
        Click a Trade ID, row, or "View" to see trade details. "Logs" opens the
        trade's logs. Status is color-coded.
      </p>
    </div>
  );
}
