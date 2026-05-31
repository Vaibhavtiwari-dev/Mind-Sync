"use server";

import { generateContent } from "@/lib/openai";
import { sanitizeNoteContent } from "@/lib/sanitize";
import { logger } from "@/lib/logger";

interface MeetingMinutesResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function generateMeetingMinutes(transcript: string): Promise<MeetingMinutesResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.warn("Missing OPENAI_API_KEY. Using mock response for development.", { action: "generateMeetingMinutes" });
      // Fallback for development if no key is present
      return {
        success: true,
        data: `## Meeting Summary
(Mock) This was a productive meeting discussing project milestones.

## Key Decisions
- Adopted new UI framework.
- Scheduled next sprint review for Friday.

## Action Items
- [ ] @John to update documentation.
- [ ] @Sarah to fix login bug.`,
      };
    }

    const prompt = `
      You are an expert meeting assistant. Analyze the following transcript and generate a structured set of meeting minutes.

      Required Sections:
      1. **Summary**: A concise paragraph summarizing the discussion.
      2. **Key Decisions**: A bulleted list of decisions made.
      3. **Action Items**: A checklist of tasks with assignees if mentioned. Format as "- [ ] Task description".

      Transcript:
      "${transcript}"

      Output Format: HTML (use <h3> for headers, <ul>/<li> for lists, <p> for text)
    `;

    const text = await generateContent(prompt);

    return { success: true, data: sanitizeNoteContent(text) };
  } catch (error) {
    logger.error("Error generating meeting minutes", error as Error, { action: "generateMeetingMinutes" });
    return { success: false, error: "Failed to generate meeting minutes. Please try again." };
  }
}
