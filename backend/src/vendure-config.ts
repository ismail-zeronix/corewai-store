import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    LanguageCode,
    VendureConfig,
} from '@vendure/core';
import {
    defaultEmailHandlers,
    EmailPlugin,
    EmailPluginDevModeOptions,
    EmailPluginOptions,
    FileBasedTemplateLoader,
} from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

import { orderAdminNotificationHandler } from './plugins/order-notifications/order-admin-notification.handler';
import { OrderNotificationsPlugin } from './plugins/order-notifications/order-notifications.plugin';
import { ProductImporterPlugin } from './plugins/product-importer/product-importer.plugin';
import { freeOverThresholdShippingCalculator } from './plugins/shipping/free-over-threshold-shipping-calculator';

const IS_DEV = process.env.APP_ENV === 'dev';
// PORT wins because hosting platforms inject it into the environment at runtime, and that
// must take precedence over any value baked into the .env file at scaffold time.
const serverPort = +process.env.PORT || +process.env.VENDURE_SERVER_PORT || 3000;
// The Next.js storefront has no custom port configured, so it runs on Next's default of 3000.
const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:3000';
// SMTP_HOST/SMTP_USER both set means real credentials are configured in .env — send for real.
// Otherwise fall back to devMode so a clone of this repo without the secrets still boots,
// writing emails to static/email/test-emails/ instead of failing on a missing transport.
const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

const emailPluginCommonOptions = {
    handlers: [...defaultEmailHandlers, orderAdminNotificationHandler],
    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
    globalTemplateVars: {
        fromAddress: process.env.MAIL_FROM_ADDRESS ?? '"example" <noreply@example.com>',
        verifyEmailAddressUrl: `${storefrontUrl}/verify`,
        passwordResetUrl: `${storefrontUrl}/password-reset`,
        changeEmailAddressUrl: `${storefrontUrl}/verify-email-address-change`,
    },
};

const emailPluginOptions: EmailPluginOptions | EmailPluginDevModeOptions = smtpConfigured
    ? {
          ...emailPluginCommonOptions,
          transport: {
              type: 'smtp',
              host: process.env.SMTP_HOST,
              port: +(process.env.SMTP_PORT ?? '465'),
              secure: process.env.SMTP_SECURE === 'true',
              auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              },
          },
      }
    : {
          ...emailPluginCommonOptions,
          devMode: true,
          outputPath: path.join(__dirname, '../static/email/test-emails'),
          route: 'mailbox',
      };

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // Which browser origins may make credentialed requests to the Shop and Admin APIs.
        // In dev any origin is reflected, so a storefront on any port works. In production set
        // CORS_ORIGINS to a comma-separated list of the origins you serve, for example
        // "https://example.com,https://admin.example.com". An unset value blocks all
        // cross-origin browser requests, which is the safe default.
        cors: {
            origin: IS_DEV ? true : (process.env.CORS_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) ?? []),
            credentials: true,
        },
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
          secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    shippingOptions: {
        shippingEligibilityCheckers: [defaultShippingEligibilityChecker],
        shippingCalculators: [defaultShippingCalculator, freeOverThresholdShippingCalculator],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {
        Order: [
            {
                name: 'customerNotes',
                type: 'string',
                nullable: true,
                label: [{ languageCode: LanguageCode.en, value: 'Delivery Notes' }],
            },
        ],
    },
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets/',
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init(emailPluginOptions),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
        OrderNotificationsPlugin,
        ProductImporterPlugin,
    ],
};
