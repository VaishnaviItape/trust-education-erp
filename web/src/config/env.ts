/**
 * Centralized Environment Configuration for Trust Education ERP Web Portal
 * Automatically loads from .env.development (dev mode) or .env.production (build mode)
 */
export const envConfig = {
  appName: (import.meta.env.VITE_APP_NAME as string) || 'Zep Foundation Bhose ERP',
  appEnv: (import.meta.env.VITE_APP_ENV as string) || (import.meta.env.MODE as string) || 'development',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000',
  erpPortalUrl: (import.meta.env.VITE_ERP_PORTAL_URL as string) || 'https://erp.abceducationtrust.org',
  publicWebsiteUrl: (import.meta.env.VITE_PUBLIC_WEBSITE_URL as string) || 'https://abceducationtrust.org',
  swaggerDocsUrl: (import.meta.env.VITE_SWAGGER_DOCS_URL as string) || 'http://localhost:5000/api-docs',
  paymentGatewayKey: (import.meta.env.VITE_PAYMENT_GATEWAY_KEY as string) || 'rzp_test_dummy_dev_key_9921',
  mapsApiKey: (import.meta.env.VITE_MAPS_API_KEY as string) || 'AIzaSyDummyDevMapsKey9921_LiveBusTracker',
  isProduction: import.meta.env.MODE === 'production',
  isDevelopment: import.meta.env.MODE === 'development',
};
