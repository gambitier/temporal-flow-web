import { redirect } from "next/navigation";

export default function TradingIndexRedirect() {
  redirect("/dashboard/trading/watchlist");
  return null;
}
