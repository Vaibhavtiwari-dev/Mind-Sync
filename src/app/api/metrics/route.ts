import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { metrics } from "@/lib/monitoring";

/**
 * GET /api/metrics
 * Returns in-process metrics counters, gauges, and histogram stats.
 * Protected — requires a valid Clerk session.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = metrics.getAllMetrics();

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        ...snapshot,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to collect metrics" },
      { status: 500 }
    );
  }
}
