/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_PORT: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ERP_PORTAL_URL: string;
  readonly VITE_PUBLIC_WEBSITE_URL: string;
  readonly VITE_SWAGGER_DOCS_URL: string;
  readonly VITE_PAYMENT_GATEWAY_KEY: string;
  readonly VITE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
