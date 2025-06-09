"use client";

import { useParams } from "next/navigation";

export default function TradeLogDetailPage() {
  const params = useParams();
  const { tradeId } = params;

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">
        Trade Logs for Trade ID: {tradeId}
      </h1>
      <p>
        This page will show logs for the selected trade, including parent/child
        relationships if applicable.
      </p>
    </div>
  );
}
