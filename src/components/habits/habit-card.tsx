"use client";

import { useState } from "react";
import { format, subDays, isSameDay } from "date-fns";
import { Check, Flame, MoreVertical, Trash2, Edit, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { logHabit, deleteHabit } from "@/actions/habits";
import { toast } from "sonner";
import { HabitForm } from "./habit-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

interface Habit {
  id: string;
  title: string;
  description?: string | null;
  frequency: "daily" | "weekly" | "custom";
  currentStreak: number | null;
  longestStreak?: number | null;
  createdAt: Date | null;
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime" | null;
  reminderTime?: string | null;
}

interface HabitCardProps {
  habit: Habit;
  completedToday: boolean;
  recentLogs?: string[]; // Array of date strings YYYY-MM-DD
}

export function HabitCard({ habit, completedToday, recentLogs = [] }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleting(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const result = await logHabit({
        habitId: habit.id,
        date: today,
        completed: !completedToday,
      });

      if (result.success) {
        toast.success(completedToday ? "Habit unchecked" : "Habit completed! 🎉");
      } else {
        toast.error(result.error || "Failed to update habit");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this habit? This cannot be undone.")) return;

    try {
      const result = await deleteHabit(habit.id);
      if (result.success) {
        toast.success("Habit deleted");
      } else {
        toast.error("Failed to delete habit");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  // Generate last 7 days for mini-visualization
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const isCompleted = recentLogs.includes(dateStr);
    const isToday = isSameDay(d, new Date());
    return { date: d, dateStr, isCompleted, isToday };
  });

  const themeMap = {
    morning: {
      accent: "text-amber-400 dark:text-amber-300",
      glow: "bg-amber-500/10 group-hover:bg-amber-500/15",
      border: "hover:border-amber-500/35 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
      gradient: "from-amber-500/20 via-transparent to-transparent",
      checkbox: "border-amber-500/30 hover:border-amber-400 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10",
      checkboxActive: "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border-amber-400",
      streakActive: "bg-amber-500/15 text-amber-400 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      dotActive: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    },
    afternoon: {
      accent: "text-sky-400 dark:text-sky-300",
      glow: "bg-sky-500/10 group-hover:bg-sky-500/15",
      border: "hover:border-sky-500/35 hover:shadow-[0_0_30px_rgba(14,165,233,0.08)]",
      gradient: "from-sky-500/20 via-transparent to-transparent",
      checkbox: "border-sky-500/30 hover:border-sky-400 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10",
      checkboxActive: "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] border-sky-400",
      streakActive: "bg-sky-500/15 text-sky-400 border-sky-500/25 shadow-[0_0_12px_rgba(14,165,233,0.15)]",
      dotActive: "bg-gradient-to-br from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]",
    },
    evening: {
      accent: "text-violet-400 dark:text-violet-300",
      glow: "bg-violet-500/10 group-hover:bg-violet-500/15",
      border: "hover:border-violet-500/35 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
      gradient: "from-violet-500/20 via-transparent to-transparent",
      checkbox: "border-violet-500/30 hover:border-violet-400 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10",
      checkboxActive: "bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border-violet-400",
      streakActive: "bg-violet-500/15 text-violet-400 border-violet-500/25 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
      dotActive: "bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    },
    anytime: {
      accent: "text-emerald-400 dark:text-emerald-300",
      glow: "bg-emerald-500/10 group-hover:bg-emerald-500/15",
      border: "hover:border-emerald-500/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      checkbox: "border-emerald-500/30 hover:border-emerald-400 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10",
      checkboxActive: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400",
      streakActive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      dotActive: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    },
  };

  const theme = themeMap[habit.timeOfDay || "anytime"];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between h-[160px] group backdrop-blur-md hover:-translate-y-0.5 shadow-lg",
          completedToday
            ? "bg-gradient-to-br from-emerald-950/20 via-zinc-900/40 to-zinc-950/80 border-emerald-500/35 shadow-[0_8px_32px_rgba(16,185,129,0.06),inset_0_1px_1px_rgba(255,255,255,0.05)]"
            : cn(
                "bg-zinc-950/30 dark:bg-zinc-950/50 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.03)]",
                theme.border
              )
        )}
      >
        {/* Glowing background meshes */}
        {completedToday ? (
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none transition-opacity duration-300" />
        ) : (
          <div className={cn("absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-30 group-hover:opacity-80", theme.glow)} />
        )}

        <div className="flex items-start justify-between gap-2 z-10">
          {/* Checkbox & Text Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
              disabled={isCompleting}
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer relative",
                completedToday ? theme.checkboxActive : theme.checkbox
              )}
            >
              {isCompleting ? (
                <div className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              ) : completedToday ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                </motion.div>
              ) : (
                <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "font-bold text-sm sm:text-base tracking-tight truncate leading-tight transition-all duration-300",
                  completedToday ? "text-zinc-500 line-through decoration-zinc-600/40 font-semibold" : "text-white"
                )}
              >
                {habit.title}
              </h4>
              {habit.description && (
                <p
                  className={cn(
                    "text-xs text-zinc-400 dark:text-zinc-400 line-clamp-1 mt-1 transition-all duration-300",
                    completedToday && "opacity-40"
                  )}
                >
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1.5 -mr-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all text-zinc-400 hover:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl min-w-[140px] p-1.5">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg py-2 px-2.5 text-xs font-medium flex items-center transition-colors">
                <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Edit Habit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-400 focus:text-red-400 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 rounded-lg py-2 px-2.5 text-xs font-medium flex items-center transition-colors">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Streaks & Mini 7-day Visualization */}
        <div className="flex items-center justify-between mt-3 pt-3.5 border-t border-white/5 z-10">
          {/* Streak Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all duration-300",
                (habit.currentStreak || 0) > 0
                  ? theme.streakActive
                  : "bg-zinc-900/50 text-zinc-500 border-zinc-800/40"
              )}
            >
              <motion.div
                animate={
                  (habit.currentStreak || 0) > 0
                    ? { scale: [1, 1.15, 1] }
                    : {}
                }
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <Flame
                  className={cn(
                    "h-3.5 w-3.5",
                    (habit.currentStreak || 0) > 0 && "fill-orange-400 text-orange-400"
                  )}
                />
              </motion.div>
              <span className="font-mono">{habit.currentStreak || 0}d streak</span>
            </div>

            {habit.longestStreak && habit.longestStreak > 0 ? (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline-block font-mono bg-zinc-900/30 px-2 py-0.5 rounded-full border border-white/5">
                Best: {habit.longestStreak}d
              </span>
            ) : null}

            {habit.reminderTime && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono bg-zinc-900/30 px-2 py-0.5 rounded-full border border-white/5">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>{habit.reminderTime}</span>
              </div>
            )}
          </div>

          {/* Mini 7-day Tracker */}
          <div className="flex gap-1.5 items-center">
            <TooltipProvider>
              {last7Days.map((day) => (
                <Tooltip key={day.dateStr}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-help border",
                        day.isCompleted
                          ? cn("border-transparent", theme.dotActive)
                          : day.isToday
                          ? "bg-transparent border-2 border-violet-500/80 shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse scale-110"
                          : "bg-white/10 dark:bg-white/10 hover:bg-white/20 border-transparent"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px] bg-zinc-950/95 border border-white/10 text-white rounded-lg p-2 shadow-2xl font-sans backdrop-blur-md">
                    <span className="font-bold">{format(day.date, "EEEE")}</span>
                    <br />
                    <span className="text-zinc-400">{format(day.date, "MMM d")}</span>
                    {day.isCompleted && (
                      <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-0.5">
                        <Check className="h-3 w-3 stroke-[3]" /> Completed
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Edit Habit Builder Drawer */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-md border-l border-white/10 bg-zinc-950/95 backdrop-blur-2xl text-white shadow-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              Edit Habit
            </SheetTitle>
            <SheetDescription className="text-zinc-400">
              Adjust your habit details, routine slot, and schedules.
            </SheetDescription>
          </SheetHeader>
          <HabitForm
            initialData={{
              id: habit.id,
              title: habit.title,
              description: habit.description ?? undefined,
              frequency: habit.frequency,
              timeOfDay: (habit.timeOfDay as any) || "anytime",
              reminderTime: habit.reminderTime ?? undefined,
            }}
            onSuccess={() => setIsEditOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
