import { Suspense } from "react";
import { getCachedHabits, getCachedHabitLogs } from "@/lib/data-fetchers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HabitCard } from "@/components/habits/habit-card";
import { CreateHabitButton } from "@/components/habits/create-habit-button";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/ui/page-transition";
import { format } from "date-fns";
import { Flame, CheckCircle, Calendar, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Habit Tracker | Mind-Sync",
  description: "Build and track your daily habits.",
};

async function HabitsList() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [habits, logs] = await Promise.all([
    getCachedHabits(userId),
    getCachedHabitLogs(userId),
  ]);

  const today = format(new Date(), "yyyy-MM-dd");

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500 glass-card rounded-2xl border border-white/10 dark:border-white/5 p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden bg-zinc-950/40 backdrop-blur-xl">
        <div className="absolute -right-32 -top-32 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 p-6 rounded-2xl mb-6 text-violet-400 border border-white/10 relative shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold mb-2 tracking-tight text-white">Unlock Your Full Potential</h3>
        <p className="text-zinc-400 max-w-sm mb-8 text-sm leading-relaxed">
          &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot; Let's write the first chapter of consistency.
        </p>
        <CreateHabitButton />
      </div>
    );
  }

  // Calculate statistics
  const completedTodayCount = habits.filter((habit) =>
    logs.some((log) => log.habitId === habit.id && log.date === today)
  ).length;
  const completionRate = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;
  const maxStreak = Math.max(...habits.map((h) => h.currentStreak || 0), 0);

  // Organize habits by time of day
  const timeOfDayGroups = {
    morning: habits.filter((h) => h.timeOfDay === "morning"),
    afternoon: habits.filter((h) => h.timeOfDay === "afternoon"),
    evening: habits.filter((h) => h.timeOfDay === "evening"),
    anytime: habits.filter((h) => h.timeOfDay === "anytime"),
  };

  const sections = [
    {
      id: "morning",
      title: "Morning Routine",
      icon: "🌅",
      items: timeOfDayGroups.morning,
      description: "Start your day with intent. Establish a solid morning routine.",
    },
    {
      id: "afternoon",
      title: "Afternoon Focus",
      icon: "☀️",
      items: timeOfDayGroups.afternoon,
      description: "Maintain momentum. Focus on mid-day tasks and wellness.",
    },
    {
      id: "evening",
      title: "Evening Reflection",
      icon: "🌙",
      items: timeOfDayGroups.evening,
      description: "Reflect and wind down. Prepare for a restful night.",
    },
    {
      id: "anytime",
      title: "Anytime Habits",
      icon: "✨",
      items: timeOfDayGroups.anytime,
      description: "Flexible habits to fit your schedule. Track anything, anytime.",
    },
  ];

  const sectionThemes = {
    morning: {
      border: "border-amber-500/20 focus-within:border-amber-500/35 hover:border-amber-500/30",
      bg: "bg-gradient-to-br from-amber-950/10 via-zinc-950/30 to-zinc-950/80",
      accent: "text-amber-400",
      glow: "shadow-[inset_0_1px_1px_rgba(245,158,11,0.05),0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.02)]",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      dot: "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    },
    afternoon: {
      border: "border-sky-500/20 focus-within:border-sky-500/35 hover:border-sky-500/30",
      bg: "bg-gradient-to-br from-sky-950/10 via-zinc-950/30 to-zinc-950/80",
      accent: "text-sky-400",
      glow: "shadow-[inset_0_1px_1px_rgba(14,165,233,0.05),0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.02)]",
      badge: "bg-sky-500/10 text-sky-300 border-sky-500/20",
      dot: "bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.5)]",
    },
    evening: {
      border: "border-violet-500/20 focus-within:border-violet-500/35 hover:border-violet-500/30",
      bg: "bg-gradient-to-br from-violet-950/10 via-zinc-950/30 to-zinc-950/80",
      accent: "text-violet-400",
      glow: "shadow-[inset_0_1px_1px_rgba(139,92,246,0.05),0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(139,92,246,0.02)]",
      badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      dot: "bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    },
    anytime: {
      border: "border-emerald-500/20 focus-within:border-emerald-500/35 hover:border-emerald-500/30",
      bg: "bg-gradient-to-br from-emerald-950/10 via-zinc-950/30 to-zinc-950/80",
      accent: "text-emerald-400",
      glow: "shadow-[inset_0_1px_1px_rgba(16,185,129,0.05),0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.02)]",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      dot: "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* High-Fidelity Stats Deck */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Today's Progress Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-5 backdrop-blur-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] group hover:border-violet-500/30 transition-all duration-300">
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Today's Progress</p>
            <h3 className="text-3xl font-extrabold font-mono bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{completionRate}%</h3>
            <p className="text-xs text-zinc-400">{completedTodayCount} of {habits.length} habits completed</p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-zinc-800/60"
                strokeWidth="4.5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-violet-500 transition-all duration-700 ease-out"
                strokeWidth="4.5"
                fill="transparent"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * completionRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white font-mono">
              {completedTodayCount}/{habits.length}
            </span>
          </div>
        </div>

        {/* Best Active Streak Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-5 backdrop-blur-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] group hover:border-orange-500/30 transition-all duration-300">
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Best Active Streak</p>
            <h3 className="text-3xl font-extrabold font-mono flex items-center gap-1.5 text-orange-400">
              <Flame className="h-7 w-7 fill-orange-500 text-orange-500 animate-pulse" />
              {maxStreak} <span className="text-sm font-semibold text-zinc-400">days</span>
            </h3>
            <p className="text-xs text-zinc-400">Streak stays burning bright!</p>
          </div>
          <span className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] group-hover:scale-105 transition-all duration-300 z-10">
            <Zap className="h-5.5 w-5.5 fill-orange-400/20" />
          </span>
        </div>

        {/* Consistency Score Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-5 backdrop-blur-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] group hover:border-emerald-500/30 transition-all duration-300 sm:col-span-2 md:col-span-1">
          <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Consistency Ledger</p>
            <h3 className="text-3xl font-extrabold font-mono text-emerald-400">
              {logs.length > 0 ? "Flourishing" : "Ready"}
            </h3>
            <p className="text-xs text-zinc-400">Total logs recorded: {logs.length}</p>
          </div>
          <span className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-all duration-300 z-10">
            <Calendar className="h-5.5 w-5.5" />
          </span>
        </div>
      </div>

      {/* Structured Routines Deck */}
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const isEmpty = section.items.length === 0;
          const theme = sectionThemes[section.id as keyof typeof sectionThemes];

          return (
            <div
              key={section.id}
              className={cn(
                "p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between hover:scale-[1.002] transition-all duration-300 shadow-2xl relative",
                theme.border,
                theme.bg,
                theme.glow
              )}
            >
              <div className="space-y-5">
                {/* Header widget */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                  <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2.5 text-white">
                    <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{section.icon}</span> 
                    <span>{section.title}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", theme.dot)} />
                    <span className={cn("text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase", theme.badge)}>
                      {section.items.length} {section.items.length === 1 ? "habit" : "habits"}
                    </span>
                  </div>
                </div>

                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center py-10 px-6 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-950/20 min-h-[190px] justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed z-10 font-medium">
                      {section.description}
                    </p>
                    <CreateHabitButton
                      defaultTimeOfDay={section.id as any}
                      variant="outline"
                      size="sm"
                      label={`Add to ${section.title}`}
                      className="mt-6 text-xs h-9 bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 rounded-xl px-4 font-semibold transition-all hover:scale-102 hover:border-white/20 active:scale-98 shadow-sm cursor-pointer z-10"
                    />
                  </div>
                ) : (
                  <div className="grid gap-3.5">
                    {section.items.map((habit) => {
                      const isCompletedToday = logs.some(
                        (log) => log.habitId === habit.id && log.date === today
                      );

                      const recentLogs = logs
                        .filter((log) => log.habitId === habit.id)
                        .map((log) => log.date);

                      return (
                        <HabitCard
                          key={habit.id}
                          habit={{
                            ...habit,
                            longestStreak: habit.longestStreak ?? 0,
                          }}
                          completedToday={isCompletedToday}
                          recentLogs={recentLogs}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitsPage() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Habit Tracker
              </span>
              <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
            </h1>
            <p className="text-sm text-zinc-400 mt-1 font-medium">Build consistency, master routines, and design your character.</p>
          </div>
          <CreateHabitButton />
        </div>

        <Separator className="bg-white/10 dark:bg-white/5" />

        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
            </div>
          }
        >
          <HabitsList />
        </Suspense>
      </div>
    </PageTransition>
  );
}
