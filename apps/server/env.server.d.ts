import { envShared } from '@workspace/config/env.shared';
declare const envServerValidated: {
    DB_PATH: string;
    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_DIALECT: "sqlite" | "mysql" | "postgres";
    DB_PORT: number;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    AUTH_COOKIE_PREFIX: string;
    TOKEN_COOKIE_SUFFIX: string;
    DATA_COOKIE_SUFFIX: string;
    RELAY_ENABLED: boolean;
    RELAY_NUM_RELAYS: 8 | 16;
    RELAY_RECONNECT_ATTEMPTS: number;
    USBRELAY_VENDOR_ID: string;
    USBRELAY_PRODUCT_ID: string;
    DB_PASS?: string | undefined;
};
type EnvServer = typeof envShared & typeof envServerValidated;
export declare const env: EnvServer;
export {};
//# sourceMappingURL=env.server.d.ts.map