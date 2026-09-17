export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ENV: string;
            VENDURE_SERVER_PORT: string;
            PORT: string;
            COOKIE_SECRET: string;
            SUPERADMIN_USERNAME: string;
            SUPERADMIN_PASSWORD: string;
            CORS_ORIGINS?: string;
            DB_HOST: string;
            DB_PORT: number;
            DB_NAME: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_SCHEMA: string;
            // Optional: unset in a fresh clone without the real Hostinger secrets, in which case
            // the EmailPlugin falls back to devMode (see vendure-config.ts).
            SMTP_HOST?: string;
            SMTP_PORT?: string;
            SMTP_SECURE?: string;
            SMTP_USER?: string;
            SMTP_PASS?: string;
            MAIL_FROM_ADDRESS?: string;
            MAIL_ADMIN_NOTIFICATION_ADDRESS: string;
            STOREFRONT_URL?: string;
        }
    }
}
