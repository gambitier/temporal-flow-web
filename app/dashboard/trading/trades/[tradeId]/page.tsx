"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useTradeDetails } from "@/lib/hooks/useTradeDetails";
import { Trade } from "@/lib/services/trading";
import { Skeleton } from "@/components/ui/skeleton";

const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: "id",
    header: "Trade ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/trading/trades/${row.original.id}`}
        className="text-purple-700 hover:underline"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusStyles = {
        PENDING:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
        ACTIVE:
          "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
        CLOSED: "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
      };

      return (
        <span
          className={`text-xs ${statusStyles[status]} px-2 py-0.5 rounded font-normal`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => row.original.symbol || "-",
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/trading/logs/${row.original.id}`)
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
  const { data: trades, isLoading, error } = useTradeDetails(tradeId as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="heading1 flex-shrink-0">Trade Details</h1>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="heading1 flex-shrink-0">Trade Details</h1>
        </div>
        <div className="text-red-500">
          Error loading trade details:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="heading1 flex-shrink-0">Trade Details</h1>
        </div>
        <div className="py-8 text-center text-gray-500">Trade not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trade Details</h1>
      </div>
      <DataTable
        columns={columns}
        data={trades}
        searchKey="id"
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
