"use client";

import { useMemo } from "react";
import { useTasks, useTimerState } from "@/store/selectors";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { Target, Flame, Clock, TrendingUp, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  icon: LucideIcon;
}

export function FocusSidebar() {
  const tasks = useTasks();
  const { completedSessions } = useTimerState();

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const completedToday = tasks.filter(
      (t) => t.completed && t.completedAt && format(new Date(t.completedAt), "yyyy-MM-dd") === today
    );

    const focusMinutesToday = completedToday.reduce(
      (acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 25),
      0
    );

    return {
      tasksCompleted: completedToday.length,
      focusMinutes: focusMinutesToday,
      sessions: completedSessions,
    };
  }, [tasks, completedSessions]);

  // Weekly progress
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const completedThisWeek = tasks.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        isWithinInterval(new Date(t.completedAt), { start: weekStart, end: weekEnd })
    );

    const focusMinutesWeek = completedThisWeek.reduce(
      (acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 25),
      0
    );

    return {
      tasksCompleted: completedThisWeek.length,
      focusHours: Math.round(focusMinutesWeek / 60),
    };
  }, [tasks]);

  // Focus goals
  const goals: FocusGoal[] = useMemo(
    () => [
      {
        id: "daily-sessions",
        label: "Daily Sessions",
        current: completedSessions,
        target: 4,
        unit: "sessions",
        icon: Target,
      },
      {
        id: "focus-hours",
        label: "Focus Hours Today",
        current: Math.round(todayStats.focusMinutes / 60),
        target: 4,
        unit: "hours",
        icon: Clock,
      },
      {
        id: "weekly-tasks",
        label: "Weekly Tasks",
        current: weeklyStats.tasksCompleted,
        target: 20,
        unit: "tasks",
        icon: CheckCircle2,
      },
    ],
    [completedSessions, todayStats.focusMinutes, weeklyStats.tasksCompleted]
  );

  // Session history (simulated based on completed tasks)
  const sessionHistory = useMemo(() => {
    const today = new Date();
    const history = [];

    // Get completed tasks from today as "sessions"
    const todayTasks = tasks
      .filter(
        (t) =>
          t.completed &&
          t.completedAt &&
          format(new Date(t.completedAt), "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
      )
      .slice(0, 5);

    for (const task of todayTasks) {
      history.push({
        id: task.id,
        title: task.title,
        duration: task.actualMinutes || task.estimatedMinutes || 25,
        completedAt: task.completedAt!,
      });
    }

    return history;
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Focus Goals */}
      <GlassCard className="bg-card/30 backdrop-blur-xl border border-white/5 shadow-xl p-0 py-4" hover="none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
            <Flame className="h-4 w-4 text-brand-pink" />
            Focus Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <goal.icon className={cn("h-3.5 w-3.5", isComplete ? "text-emerald-400" : "text-muted-foreground/60")} />
                    {goal.label}
                  </span>
                  <span className={cn("font-medium", isComplete ? "text-emerald-400 font-semibold" : "text-foreground")}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-1.5 bg-white/5"
                  indicatorClassName={cn(isComplete ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-brand-purple to-brand-pink")}
                />
              </div>
            );
          })}
        </CardContent>
      </GlassCard>

      {/* Today's Stats */}
      <GlassCard className="bg-card/30 backdrop-blur-xl border border-white/5 shadow-xl p-0 py-4" hover="none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
            <TrendingUp className="h-4 w-4 text-brand-blue" />
            Today&apos;s Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
              <div className="text-xl font-bold tracking-tight text-foreground">{todayStats.sessions}</div>
              <div className="text-muted-foreground text-[10px] uppercase font-medium mt-0.5">Sessions</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
              <div className="text-xl font-bold tracking-tight text-foreground">
                {Math.round(todayStats.focusMinutes / 60)}h
              </div>
              <div className="text-muted-foreground text-[10px] uppercase font-medium mt-0.5">Focus Time</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
              <div className="text-xl font-bold tracking-tight text-foreground">{todayStats.tasksCompleted}</div>
              <div className="text-muted-foreground text-[10px] uppercase font-medium mt-0.5">Tasks Done</div>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      {/* Session History */}
      <GlassCard className="bg-card/30 backdrop-blur-xl border border-white/5 shadow-xl p-0 py-4" hover="none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
            <Clock className="h-4 w-4 text-brand-purple" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionHistory.length > 0 ? (
            <div className="space-y-2.5">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className="group bg-white/[0.02] border border-white/[0.04] flex items-center gap-3 rounded-xl p-3 hover:bg-white/[0.05] hover:border-white/10 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary-foreground/95 transition-colors">
                      {session.title}
                    </p>
                    <p className="text-muted-foreground text-[10px] mt-0.5">
                      {session.duration} min • {format(new Date(session.completedAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-6 text-center text-xs">
              <p className="font-medium">No sessions completed today</p>
              <p className="mt-1 text-[10px] text-muted-foreground/60">Start a focus session to track progress</p>
            </div>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
