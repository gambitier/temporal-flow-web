"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useTrades } from "@/lib/hooks/useTrades";
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
              router.push(`/dashboard/trading/trades/${row.original.id}`)
            }
          >
            View
          </Button>
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

export default function TradesPage() {
  const { data: trades, isLoading, error } = useTrades();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="heading1 flex-shrink-0">Trades</h1>
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
          <h1 className="heading1 flex-shrink-0">Trades</h1>
        </div>
        <div className="text-red-500">
          Error loading trades:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="heading1 flex-shrink-0">Trades</h1>
      </div>
      <DataTable
        columns={columns}
        data={trades || []}
        searchKey="id"
        tableId="trades-table"
      />
      <p className="text-muted-foreground text-sm">
        Click a Trade ID, row, or "View" to see trade details. "Logs" opens the
        trade's logs. Status is color-coded.
      </p>
    </div>
  );
}
