import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

export function useAuth() {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // Store the token with the correct format
            localStorage.setItem("token", `${data.tokenType} ${data.accessToken}`);
            // Redirect to dashboard
            router.push("/dashboard");
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            // Redirect to login page with success message
            router.push("/login?registered=true");
        },
    });

    return {
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        error: loginMutation.error || registerMutation.error,
    };
} 