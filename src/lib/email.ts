/**
 * Email client wrapper
 * Uses Resend API in production, console.log in development
 */

import { logger } from "@/lib/logger";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Maximum number of retry attempts for sending an email
 */
const MAX_RETRIES = 3;

/**
 * Base delay in milliseconds for exponential backoff (500ms * 2^attempt)
 */
const BASE_RETRY_DELAY_MS = 500;

/**
 * Attempt to send a single email to Resend API.
 * Returns true on success, false on non-retryable failure, throws on retryable failure.
 */
async function attemptResend(options: EmailOptions): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: options.from ?? "Mind-Sync <noreply@mindsync.app>",
      to: [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  if (response.ok) return true;

  const errorBody = await response.text();

  // Non-retryable: 4xx errors other than 429 (rate limit) should not be retried
  if (response.status >= 400 && response.status < 500 && response.status !== 429) {
    logger.error("Resend API rejected email (non-retryable)", new Error(errorBody), {
      action: "sendEmail",
      status: response.status,
      to: options.to,
    });
    return false;
  }

  // Retryable: 5xx or 429
  throw new Error(`Resend API error (${response.status}): ${errorBody}`);
}

/**
 * Send an email using Resend API (production) or log to console (dev).
 * Automatically retries with exponential backoff on transient failures.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // Dev fallback — log to console
    logger.info("📧 Email (dev mode - not sent)", {
      action: "sendEmail",
      to: options.to,
      subject: options.subject,
    });
    console.log("─── EMAIL PREVIEW ───");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`From: ${options.from ?? "Mind-Sync <noreply@mindsync.app>"}`);
    console.log("─── HTML BODY ───");
    console.log(options.html.slice(0, 500) + "...");
    console.log("─── END EMAIL ───");
    return true;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await attemptResend(options);
      if (result) {
        logger.info("Email sent", {
          action: "sendEmail",
          to: options.to,
          subject: options.subject,
          attempt: attempt + 1,
        });
        return true;
      }
      // Non-retryable failure (false returned, no throw)
      return false;
    } catch (error) {
      lastError = error as Error;
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      logger.warn(`Email send attempt ${attempt + 1}/${MAX_RETRIES} failed`, {
        action: "sendEmail",
        to: options.to,
        subject: options.subject,
        attempt: attempt + 1,
        error: (error as Error).message,
      });

      if (!isLastAttempt) {
        // Exponential backoff: 500ms, 1000ms, 2000ms
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error("Email permanently failed after all retries", lastError!, {
    action: "sendEmail",
    to: options.to,
    subject: options.subject,
  });
  return false;
}
