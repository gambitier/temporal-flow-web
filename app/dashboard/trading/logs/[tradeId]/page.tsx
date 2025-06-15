"use client";

import { useParams } from "next/navigation";
import { useTradeLogs } from "@/lib/hooks/useTradeLogs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TradeLog } from "@/lib/services/trading";

const columns: ColumnDef<TradeLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => row.original.message,
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-2">
        <pre className="text-sm overflow-auto max-h-32">
          {JSON.stringify(row.original.metadata, null, 2)}
        </pre>
      </div>
    ),
  },
];

export default function TradeLogDetailPage() {
  const params = useParams();
  const { tradeId } = params;
  const { data: logs, isLoading, error } = useTradeLogs(tradeId as string);

  const getBackLink = () => {
    if (!logs || logs.length === 0) return tradeId;
    const parentTradeId = logs[0].metadata.parentTradeID;
    return parentTradeId || tradeId;
  };

  const getTradeInfo = () => {
    if (!logs || logs.length === 0) return { symbol: "-" };
    const firstLog = logs[0];
    return {
      symbol: firstLog.metadata.order?.symbol || "-",
    };
  };

  const renderHeader = () => {
    const { symbol } = getTradeInfo();
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="space-y-1">
          <h1 className="heading1 flex-shrink-0">Trade Logs</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
            <p>Trade ID: {tradeId}</p>
            <p>Symbol: {symbol}</p>
          </div>
        </div>
        <Link
          href={`/dashboard/trading/trades/${getBackLink()}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Trade Details
        </Link>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {renderHeader()}
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
        {renderHeader()}
        <div className="text-red-500">
          Error loading trade logs:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="space-y-6">
        {renderHeader()}
        <div className="py-8 text-center text-gray-500">
          No logs found for this trade.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderHeader()}
      <DataTable
        columns={columns}
        data={logs}
        searchKey="message"
        tableId="trade-logs-table"
      />
    </div>
  );
}
