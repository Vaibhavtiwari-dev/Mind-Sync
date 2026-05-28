"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag } from "lucide-react";

export type Priority = "P0" | "P1" | "P2" | "P3";

interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const priorityConfig: Record<Priority, PriorityConfig> = {
  P0: {
    label: "P0",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 dark:border-rose-500/40",
    description: "Critical",
  },
  P1: {
    label: "P1",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-500/40",
    description: "High",
  },
  P2: {
    label: "P2",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/10 dark:bg-sky-500/20 border-sky-500/30 dark:border-sky-500/40",
    description: "Medium",
  },
  P3: {
    label: "P3",
    color: "text-slate-500 dark:text-slate-400",
    bgColor: "bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/20 dark:border-slate-500/30",
    description: "Low",
  },
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
  showLabel?: boolean;
}

/**
 * Visual priority indicator badge
 */
export function PriorityBadge({
  priority,
  size = "sm",
  showLabel = true,
}: PriorityBadgeProps) {
  switch (priority) {
    case "P0":
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-black border bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)] animate-pulse-glow uppercase tracking-wider inline-flex items-center gap-1",
            size === "sm" ? "text-[9px] px-1.5 py-0" : "text-xs px-2 py-0.5"
          )}
        >
          <span className="h-1 w-1 rounded-full bg-red-500 animate-ping shrink-0" />
          {showLabel ? "P0 • CRITICAL" : <Flag className="h-3 w-3 shrink-0" />}
        </Badge>
      );
    case "P1":
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-black border bg-orange-500/10 text-orange-400 border-orange-500/30 uppercase tracking-wider inline-flex items-center gap-1",
            size === "sm" ? "text-[9px] px-1.5 py-0" : "text-xs px-2 py-0.5"
          )}
        >
          <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse shrink-0" />
          {showLabel ? "P1 • HIGH" : <Flag className="h-3 w-3 shrink-0" />}
        </Badge>
      );
    case "P2":
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-black border bg-blue-500/10 text-blue-400 border-blue-500/30 uppercase tracking-wider inline-flex items-center gap-1",
            size === "sm" ? "text-[9px] px-1.5 py-0" : "text-xs px-2 py-0.5"
          )}
        >
          <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
          {showLabel ? "P2 • MEDIUM" : <Flag className="h-3 w-3 shrink-0" />}
        </Badge>
      );
    case "P3":
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-bold border bg-slate-500/10 text-slate-400 border-slate-500/20 uppercase tracking-wider inline-flex items-center gap-1",
            size === "sm" ? "text-[9px] px-1.5 py-0" : "text-xs px-2 py-0.5"
          )}
        >
          <span className="h-1 w-1 rounded-full bg-slate-500 shrink-0" />
          {showLabel ? "P3 • LOW" : <Flag className="h-3 w-3 shrink-0" />}
        </Badge>
      );
  }
}

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  size?: "sm" | "md";
}

/**
 * Dropdown for selecting task priority
 */
export function PrioritySelector({
  value,
  onChange,
  size = "sm",
}: PrioritySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <PriorityBadge priority={value} size={size} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {(Object.keys(priorityConfig) as Priority[]).map((p) => (
          <DropdownMenuItem
            key={p}
            onClick={() => onChange(p)}
            className="flex items-center justify-between"
          >
            <span className={priorityConfig[p].color}>
              {priorityConfig[p].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {priorityConfig[p].description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
