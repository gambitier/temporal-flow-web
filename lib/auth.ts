import { cookies } from 'next/headers';

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch('http://localhost:8085/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
}

export async function logout() {
    // Clear the token from localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
    }
}

export function getToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('jwtToken');
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export async function getAuthHeaders(): Promise<HeadersInit> {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
} 