import { useQuery } from "@tanstack/react-query";

interface Watchlist {
    id: string;
    name: string;
    created_at: number;
    updated_at: number;
}

interface Symbol {
    id: string;
    symbolId: string;
    symbol: string;
    name: string;
    token: string;
    createdAt: number;
    updatedAt: number;
}

const fetchWatchlists = async (): Promise<Watchlist[]> => {
    if (typeof window === 'undefined') return [];

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:8085/api/v1/brokers/angel-one/symbols/watchlists", {
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to fetch watchlists" }));
        throw new Error(error.error || "Failed to fetch watchlists");
    }

    return response.json();
};

const fetchWatchlistSymbols = async (watchlistId: string): Promise<Symbol[]> => {
    if (typeof window === 'undefined') return [];

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(
        `http://localhost:8085/api/v1/brokers/angel-one/symbols/watchlists/${watchlistId}`,
        {
            headers: {
                "Authorization": token,
            },
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to fetch watchlist symbols" }));
        throw new Error(error.error || "Failed to fetch watchlist symbols");
    }

    return response.json();
};

export function useWatchlists() {
    const watchlistsQuery = useQuery({
        queryKey: ["watchlists"],
        queryFn: fetchWatchlists,
        retry: 1,
        refetchOnWindowFocus: true,
    });

    return {
        watchlists: watchlistsQuery.data || [],
        isLoading: watchlistsQuery.isLoading,
        error: watchlistsQuery.error,
    };
}

export function useWatchlistSymbols(watchlistId: string | null) {
    const symbolsQuery = useQuery({
        queryKey: ["watchlist", watchlistId, "symbols"],
        queryFn: () => fetchWatchlistSymbols(watchlistId!),
        enabled: !!watchlistId,
        retry: 1,
        refetchOnWindowFocus: true,
    });

    return {
        symbols: symbolsQuery.data || [],
        isLoading: symbolsQuery.isLoading,
        error: symbolsQuery.error,
    };
} 