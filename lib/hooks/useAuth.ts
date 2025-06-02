import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import websocketService from "@/lib/services/websocket";

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    first_name: string;
    last_name: string;
}

interface LoginResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

interface RegisterResponse {
    id: string;
}

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch("http://localhost:8085/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
    }

    return response.json();
};

const registerUser = async (
    credentials: RegisterCredentials
): Promise<RegisterResponse> => {
    const response = await fetch("http://localhost:8085/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
    }

    return response.json();
};

const fetchUserData = async (token: string): Promise<User> => {
    const response = await fetch("http://localhost:8085/api/v1/users/me", {
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch user data");
    }

    const data = await response.json();
    if (!data.id || !data.email) {
        throw new Error("Invalid user data received");
    }

    return data;
};

const logoutUser = async (token: string): Promise<void> => {
    const response = await fetch("http://localhost:8085/api/v1/auth/logout", {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Logout failed");
    }
};

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserData(token)
                .then(setUser)
                .catch((error) => {
                    console.error("Error fetching user data on mount:", error);
                    // If user data fetch fails, clear the token and redirect to login
                    localStorage.removeItem("token");
                    router.push("/login");
                });
        }
    }, []);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            localStorage.setItem("tokenType", data.tokenType);
            localStorage.setItem("accessToken", data.accessToken);
            const token = `${data.tokenType} ${data.accessToken}`;
            localStorage.setItem("token", token);
            const userData = await fetchUserData(token);
            setUser(userData);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/login?registered=true");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            return logoutUser(token);
        },
        onSuccess: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenType");
            setUser(null);
            websocketService.disconnect();
            router.push("/login");
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        }
    });

    const logout = () => {
        logoutMutation.mutate();
    };

    return {
        user,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        error: loginMutation.error || registerMutation.error || logoutMutation.error,
    };
} 