/**
 * Centralized OpenAI client for Mind-Sync
 * Uses the specific /v1/responses endpoint and gpt-5.4-mini model
 */

import { getEnv } from "./env";
import { logger } from "./logger";
import { APIError } from "./errors";

export interface OpenAIResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
}

/**
 * Generate content using the provided OpenAI endpoint and model
 */
export async function generateContent(prompt: string): Promise<string> {
  const apiKey = getEnv("OPENAI_API_KEY");
  const endpoint = "https://api.openai.com/v1/responses";
  const model = "gpt-5.4-mini";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        input: prompt,
        store: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("OpenAI API error", new Error(errorBody), {
        action: "generateContent",
        status: response.status,
      });
      throw new APIError("OpenAI", `API returned ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    
    // Robust extraction based on typical OpenAI-like structures
    // The provided curl suggests the input/store structure, but the response field might vary.
    // We'll prioritize 'choices[0].message.content' but fallback to other common fields.
    const content = data.choices?.[0]?.message?.content || 
                    data.output || 
                    data.text || 
                    (typeof data === 'string' ? data : JSON.stringify(data));

    if (!content) {
      throw new APIError("OpenAI", "No content found in response");
    }

    return content;
  } catch (error) {
    logger.error("Failed to generate content via OpenAI", error as Error, {
      action: "generateContent",
    });
    throw error;
  }
}
