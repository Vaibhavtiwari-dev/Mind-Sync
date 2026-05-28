"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, Calendar as CalendarIcon, List, LayoutPanelLeft } from "lucide-react";

export type CalendarViewType = "month" | "week" | "day" | "agenda";

interface CalendarViewTabsProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

export function CalendarViewTabs({ currentView, onViewChange }: CalendarViewTabsProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md flex items-center rounded-xl border border-white/10 p-1 shadow-md gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("month")}
        className={cn(
          "h-8 px-3 text-xs font-semibold rounded-lg transition-all duration-300 gap-1.5",
          currentView === "month"
            ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:text-white shadow-[0_2px_10px_rgba(139,92,246,0.3)] font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        <CalendarIcon className="h-3.5 w-3.5" />
        Month
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("week")}
        className={cn(
          "h-8 px-3 text-xs font-semibold rounded-lg transition-all duration-300 gap-1.5",
          currentView === "week"
            ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:text-white shadow-[0_2px_10px_rgba(139,92,246,0.3)] font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        <LayoutPanelLeft className="h-3.5 w-3.5 rotate-90" />
        Week
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("day")}
        className={cn(
          "h-8 px-3 text-xs font-semibold rounded-lg transition-all duration-300 gap-1.5",
          currentView === "day"
            ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:text-white shadow-[0_2px_10px_rgba(139,92,246,0.3)] font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Day
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("agenda")}
        className={cn(
          "h-8 px-3 text-xs font-semibold rounded-lg transition-all duration-300 gap-1.5",
          currentView === "agenda"
            ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:text-white shadow-[0_2px_10px_rgba(139,92,246,0.3)] font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        <List className="h-3.5 w-3.5" />
        Agenda
      </Button>
    </div>
  );
}
