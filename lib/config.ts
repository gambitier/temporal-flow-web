interface ApiEndpoints {
    login: string;
    register: string;
    wsUrl: string;
}

interface ApiConfig {
    baseUrl: string;
    endpoints: ApiEndpoints;
}

interface Config {
    api: ApiConfig;
}

const config: Config = {
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085",
        endpoints: {
            login: "/api/v1/auth/login",
            register: "/api/v1/users",
            wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8085/ws",
        },
    },
} as const;

export type { Config, ApiConfig, ApiEndpoints };
export default config; 