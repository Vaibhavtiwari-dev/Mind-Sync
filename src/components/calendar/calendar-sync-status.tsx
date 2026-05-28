"use client";

import { RefreshCw, Check, AlertCircle, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarSync } from "@/hooks/use-calendar-sync";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

export function CalendarSyncStatus() {
  const { syncState, fullSync } = useCalendarSync();

  const getStatusIcon = () => {
    switch (syncState.status) {
      case "syncing":
        return <RefreshCw className="h-3.5 w-3.5 animate-spin" />;
      case "success":
        return <Cloud className="h-3.5 w-3.5 text-emerald-400" />;
      case "error":
        return <CloudOff className="h-3.5 w-3.5 text-rose-400" />;
      default:
        return syncState.lastSynced ? (
          <Cloud className="text-muted-foreground/80 h-3.5 w-3.5" />
        ) : (
          <CloudOff className="text-muted-foreground/80 h-3.5 w-3.5" />
        );
    }
  };

  const getStatusText = () => {
    switch (syncState.status) {
      case "syncing":
        return "Syncing Google Calendar...";
      case "success":
        return syncState.lastSynced
          ? `Synced ${formatDistanceToNow(syncState.lastSynced, { addSuffix: true })}`
          : "Synced";
      case "error":
        return syncState.error || "Sync failed";
      default:
        return syncState.lastSynced
          ? `Last sync: ${formatDistanceToNow(syncState.lastSynced, { addSuffix: true })}`
          : "Not synced yet";
    }
  };

  const getStatusColorClass = () => {
    switch (syncState.status) {
      case "syncing":
        return "bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.12)]";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.12)]";
      case "error":
        return "bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.12)]";
      default:
        return "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={fullSync}
            disabled={syncState.status === "syncing"}
            className={cn(
              "backdrop-blur-md border px-3 py-1.5 h-9 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-300 hover-lift",
              getStatusColorClass()
            )}
          >
            {getStatusIcon()}
            <span className="hidden text-xs sm:inline">
              {syncState.status === "syncing" ? "Syncing..." : "Google Sync"}
            </span>
            {syncState.status !== "syncing" && (
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                    syncState.status === "success" && "bg-emerald-400 animate-ping",
                    syncState.status === "error" && "bg-rose-400 animate-ping",
                    !syncState.status && "bg-muted-foreground/40"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-1.5 w-1.5",
                    syncState.status === "success" && "bg-emerald-500",
                    syncState.status === "error" && "bg-rose-500",
                    !syncState.status && "bg-muted-foreground/60"
                  )}
                />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="glass border border-white/10 text-xs px-3 py-1.5 rounded-lg shadow-lg">
          <p className="font-semibold">{getStatusText()}</p>
          {syncState.pendingChanges > 0 && (
            <p className="text-[10px] text-amber-400 mt-0.5">{syncState.pendingChanges} pending changes</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
