"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useHydrationActions } from "@/store/selectors";
import { getTasks } from "@/actions/tasks";
import { getEvents } from "@/actions/events";
import { getNotes } from "@/actions/notes";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface SyncProviderProps {
  children: React.ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { setTasks, setEvents, setNotes } = useHydrationActions();
  const hasHydrated = useRef(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    if (hasHydrated.current) return;

    try {
      console.log("[SyncProvider] Fetching data client-side...");
      const [tasksResult, eventsResult, notesResult] = await Promise.all([
        getTasks(),
        getEvents(),
        getNotes(),
      ]);

      if (tasksResult.success) {
        setTasks(
          tasksResult.data.map((t) => ({
            id: t.id,
            title: t.title,
            completed: t.status === "Done",
            columnId:
              t.status === "Done"
                ? "Done"
                : t.status === "InProgress"
                  ? "InProgress"
                  : "Todo",
            dueDate: t.dueDate
              ? t.dueDate.toISOString()
              : new Date().toISOString(),
            priority: (t.priority as "P0" | "P1" | "P2" | "P3") || "P2",
            tags: t.tags || [],
            recurrence: t.recurrence as {
              type: "daily" | "weekly" | "monthly";
              interval: number;
            } | null,
          }))
        );
      }

      if (eventsResult.success) {
        setEvents(
          eventsResult.data.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.startTime.toISOString(),
            end: e.endTime.toISOString(),
            type: "work" as const,
            googleId: e.googleEventId,
          }))
        );
      }

      if (notesResult.success) {
        setNotes(
          notesResult.data.map((n) => ({
            id: n.id,
            title: n.title,
            preview: "...",
            content: n.content as string,
            date: n.createdAt
              ? n.createdAt.toISOString()
              : new Date().toISOString(),
            tags: [],
            type: "personal" as const,
          }))
        );
      }

      hasHydrated.current = true;
      setFetchError(false);
      console.log("[SyncProvider] Data sync complete");
    } catch (error) {
      console.error("[SyncProvider] Failed to fetch data:", error);
      setFetchError(true);
      toast.error("Failed to load your data. Check your connection and try again.", {
        id: "sync-error",
        duration: 60000,
        action: {
          label: "Retry",
          onClick: () => {
            hasHydrated.current = false;
            fetchData();
          },
        },
      });
    }
  }, [isSignedIn, isLoaded, setTasks, setEvents, setNotes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children}</>;
}
