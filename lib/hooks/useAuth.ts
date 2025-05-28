import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import config from "@/lib/config";
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
        throw new Error("Failed to fetch user data");
    }

    return response.json();
};

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserData(token).then(setUser);
            websocketService.connect();
        }
    }, []);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            const token = `${data.tokenType} ${data.accessToken}`;
            localStorage.setItem("token", token);
            const userData = await fetchUserData(token);
            setUser(userData);
            await websocketService.connect();
            router.push("/dashboard");
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/login?registered=true");
        },
    });

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        websocketService.disconnect();
        router.push("/login");
    };

    return {
        user,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        error: loginMutation.error || registerMutation.error,
    };
} 