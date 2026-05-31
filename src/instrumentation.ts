import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      // Sample 100% of traces in dev, 10% in production to reduce overhead
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
      debug: false,
    });
  }

  // Edge runtime Sentry init removed due to Node.js API incompatibility in Next.js 16 (process.features)
}

export const onRequestError = Sentry.captureRequestError;
