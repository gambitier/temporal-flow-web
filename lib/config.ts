interface ApiEndpoints {
    login: string;
    register: string;
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
        },
    },
} as const;

export type { Config, ApiConfig, ApiEndpoints };
export default config; 