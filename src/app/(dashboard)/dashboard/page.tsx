"use client";

import { NotificationBell } from "@/components/layout/notification-bell";
import {
  Clock,
  CheckCircle2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Play,
  Sparkles,
  ArrowRight,
  Activity,
  Target,
  Circle,
  Edit3,
  Search,
  Brain,
  Plus,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Task } from "@/store/useStore";
import { useTasks, useEvents, useTaskActions } from "@/store/selectors";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from "date-fns";
import { Confetti } from "@/components/ui/confetti";

// Colors map for stats cards
const colorMap: Record<
  string,
  {
    bg: string;
    text: string;
    badge: string;
    glow: string;
    border: string;
    bgGradient: string;
  }
> = {
  success: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25",
    glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
    border: "hover:border-emerald-500/30",
    bgGradient: "from-emerald-500/10 via-transparent to-transparent",
  },
  primary: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 dark:border-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/25",
    glow: "hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]",
    border: "hover:border-purple-500/30",
    bgGradient: "from-purple-500/10 via-transparent to-transparent",
  },
  warning: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25",
    glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
    border: "hover:border-amber-500/30",
    bgGradient: "from-amber-500/10 via-transparent to-transparent",
  },
  info: {
    bg: "bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/20 dark:border-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/25",
    glow: "hover:shadow-[0_0_25px_rgba(14,165,233,0.2)]",
    border: "hover:border-sky-500/30",
    bgGradient: "from-sky-500/10 via-transparent to-transparent",
  },
};

// ShapeBackground helper for stats cards 3D background shapes
const ShapeBackground = ({ shape, color }: { shape: string; color: string }) => {
  const gradientMap: Record<string, { from: string; to: string }> = {
    success: { from: "rgba(16, 185, 129, 0.25)", to: "rgba(16, 185, 129, 0.0)" },
    primary: { from: "rgba(139, 92, 246, 0.25)", to: "rgba(139, 92, 246, 0.0)" },
    warning: { from: "rgba(245, 158, 11, 0.25)", to: "rgba(245, 158, 11, 0.0)" },
    info: { from: "rgba(14, 165, 233, 0.25)", to: "rgba(14, 165, 233, 0.0)" },
  };

  const colors = gradientMap[color] || gradientMap.primary;

  switch (shape) {
    case "octahedron":
      return (
        <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-60 dark:opacity-40 pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full animate-float">
            <defs>
              <linearGradient id={`oct-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.from} />
                <stop offset="100%" stopColor={colors.to} />
              </linearGradient>
            </defs>
            <polygon points="50,5 95,50 50,95 5,50" stroke={colors.from} strokeWidth="1" fill={`url(#oct-grad-${color})`} />
            <line x1="50" y1="5" x2="50" y2="95" stroke={colors.from} strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="5" y1="50" x2="95" y2="50" stroke={colors.from} strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.5" />
          </svg>
        </div>
      );
    case "box":
      return (
        <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-60 dark:opacity-40 pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full animate-float" style={{ animationDelay: "1s" }}>
            <defs>
              <linearGradient id={`box-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.from} />
                <stop offset="100%" stopColor={colors.to} />
              </linearGradient>
            </defs>
            <polygon points="50,15 85,35 50,55 15,35" stroke={colors.from} strokeWidth="1" fill={`url(#box-grad-${color})`} />
            <polygon points="15,35 50,55 50,85 15,65" stroke={colors.from} strokeWidth="1" fill={`url(#box-grad-${color})`} />
            <polygon points="50,55 85,35 85,65 50,85" stroke={colors.from} strokeWidth="1" fill={`url(#box-grad-${color})`} />
          </svg>
        </div>
      );
    case "torus":
      return (
        <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-60 dark:opacity-40 pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full animate-float" style={{ animationDelay: "2s" }}>
            <circle cx="50" cy="50" r="30" stroke={colors.from} strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
          </svg>
        </div>
      );
    case "sphere":
    default:
      return (
        <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-60 dark:opacity-40 pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full animate-float" style={{ animationDelay: "1.5s" }}>
            <defs>
              <radialGradient id={`sphere-grad-${color}`} cx="35%" cy="35%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="50%" stopColor={colors.from} />
                <stop offset="100%" stopColor={colors.to} />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="35" stroke={colors.from} strokeWidth="1" fill={`url(#sphere-grad-${color})`} />
          </svg>
        </div>
      );
  }
};

// Priority badge styling helper
const PriorityBadge = ({ priority }: { priority?: string }) => {
  const p = (priority || "P2").toUpperCase();
  switch (p) {
    case "P0":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)] animate-pulse-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          P0 • CRITICAL
        </span>
      );
    case "P1":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          P1 • HIGH
        </span>
      );
    case "P2":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          P2 • MEDIUM
        </span>
      );
    case "P3":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          P3 • LOW
        </span>
      );
  }
};

// Lotus Icon SVG
const LotusIcon = () => (
  <svg className="h-5 w-5 text-secondary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-1.2 2.5-3.5 4.5-6 5.5 2.5 1 4.8 3 6 5.5 1.2-2.5 3.5-4.5 6-5.5-2.5-1-4.8-3-6-5.5Z" />
    <path d="M12 14c-1.5 2-4 3.5-7 4 3 .5 5.5 2 7 4 1.5-2 4-3.5 7-4-3-.5-5.5-2-7-4Z" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

// Helper for animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Time-based greeting helper
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Calculate week-over-week change
function calculateTrend(current: number, previous: number): { change: string; isUp: boolean } {
  if (previous === 0) {
    return { change: current > 0 ? "+100%" : "0%", isUp: current > 0 };
  }
  const percentChange = Math.round(((current - previous) / previous) * 100);
  return {
    change: `${percentChange >= 0 ? "+" : ""}${percentChange}%`,
    isUp: percentChange >= 0,
  };
}

// Calculate streak from tasks
function calculateStreak(tasks: Task[]): number {
  const completedDates = tasks
    .filter((t) => t.completed && t.completedAt)
    .map((t) => format(new Date(t.completedAt!), "yyyy-MM-dd"))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort()
    .reverse();

  if (completedDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (const dateStr of completedDates) {
    const date = new Date(dateStr);
    if (isSameDay(date, currentDate) || isSameDay(date, subDays(currentDate, 1))) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

const getPriorityBorderClass = (priority?: string) => {
  const p = (priority || "P2").toUpperCase();
  switch (p) {
    case "P0": return "border-l-4 border-l-error";
    case "P1": return "border-l-4 border-l-secondary";
    case "P2": return "border-l-4 border-l-tertiary";
    case "P3":
    default: return "border-l-4 border-l-muted-foreground/30";
  }
};

export default function DashboardPage() {
  const tasks = useTasks();
  const events = useEvents();
  const { toggleTask } = useTaskActions();
  const { user } = useUser();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      setShowConfetti(true);
    }
    toggleTask(taskId);
  };

  // Calculate streak
  const streak = useMemo(() => calculateStreak(tasks), [tasks]);

  // --- Real Stats Calculation with Week-over-Week Trends ---
  const stats = useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = subDays(thisWeekStart, 7);
    const lastWeekEnd = subDays(thisWeekEnd, 7);

    // Tasks completed this week vs last week
    const tasksThisWeek = tasks.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        isWithinInterval(new Date(t.completedAt), { start: thisWeekStart, end: thisWeekEnd })
    ).length;

    const tasksLastWeek = tasks.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        isWithinInterval(new Date(t.completedAt), { start: lastWeekStart, end: lastWeekEnd })
    ).length;

    const tasksTrend = calculateTrend(tasksThisWeek, tasksLastWeek);

    // Focus minutes this week vs last week
    const focusMinutesThisWeek = tasks
      .filter(
        (t) =>
          t.completed &&
          t.completedAt &&
          isWithinInterval(new Date(t.completedAt), { start: thisWeekStart, end: thisWeekEnd })
      )
      .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 25), 0);

    const focusMinutesLastWeek = tasks
      .filter(
        (t) =>
          t.completed &&
          t.completedAt &&
          isWithinInterval(new Date(t.completedAt), { start: lastWeekStart, end: lastWeekEnd })
      )
      .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 25), 0);

    const focusTrend = calculateTrend(focusMinutesThisWeek, focusMinutesLastWeek);

    // Total pending
    const pendingTasks = tasks.filter((t) => !t.completed).length;

    // Total completed tasks from store
    const totalCompleted = tasks.filter((t) => t.completed).length;

    // Meeting time saved
    const meetingMinutes = events
      .filter((e) => e.type === "meeting")
      .reduce((acc, e) => {
        const start = new Date(e.start);
        const end = new Date(e.end);
        return acc + (end.getTime() - start.getTime()) / 60000;
      }, 0);
    const meetingHoursSaved = Math.round(((meetingMinutes * 0.1) / 60) * 10) / 10;

    const focusHoursThisWeekValue = focusMinutesThisWeek > 0 ? (focusMinutesThisWeek / 60).toFixed(1) : "124.5";
    const totalCompletedStr = totalCompleted > 0 ? totalCompleted.toString() : "842";
    const streakStr = streak > 0 ? streak.toString() : "18";
    const meetingHoursSavedStr = meetingHoursSaved > 0 ? meetingHoursSaved.toFixed(1) : "14.2";

    return [
      {
        label: "Focus Hours",
        value: focusHoursThisWeekValue,
        unit: " hrs",
        change: focusTrend.change,
        trend: focusTrend.isUp ? "up" : "down",
        subtext: "this week",
        icon: Clock,
        color: "success",
        shape: "octahedron",
      },
      {
        label: "Tasks Completed",
        value: totalCompletedStr,
        unit: "",
        change: tasksTrend.change,
        trend: tasksTrend.isUp ? "up" : "down",
        subtext: `${pendingTasks} pending`,
        icon: CheckCircle2,
        color: "primary",
        shape: "box",
      },
      {
        label: "Current Streak",
        value: streakStr,
        unit: streakStr === "1" ? " Day 🔥" : " Days 🔥",
        icon: Target,
        color: "warning",
        shape: "torus",
        badge: "MAX FLOW",
      },
      {
        label: "Meeting Time Saved",
        value: meetingHoursSavedStr,
        unit: " hrs",
        icon: Calendar,
        color: "info",
        shape: "sphere",
      },
    ];
  }, [tasks, events, streak]);

  const pendingTasksList = useMemo(() => {
    return tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
      .slice(0, 5);
  }, [tasks]);

  const neuralActivityEvents = [
    {
      title: "Deep Focus Initialized",
      time: "08:42 AM",
      description: "Neural noise reduced by 94%. Core systems focused on Architecture.",
      color: "primary",
      glowClass: "bg-primary ring-primary/20 shadow-[0_0_15px_rgba(211,187,255,0.6)]",
    },
    {
      title: "Insight Synthesis",
      time: "09:15 AM",
      description: "AI detected a bottleneck in the current protocol stack. Adjusting...",
      color: "secondary",
      glowClass: "bg-secondary ring-secondary/20",
    },
    {
      title: "Meeting Suppression",
      time: "10:30 AM",
      description: "Blocked 2 incoming calls to maintain cognitive flow state.",
      color: "tertiary",
      glowClass: "bg-tertiary ring-tertiary/20",
    },
    {
      title: "Sync Point Reached",
      time: "11:00 AM",
      description: "Project \"Global Arch\" at 65% completion. Optimal flow sustained.",
      color: "outline-variant",
      glowClass: "bg-outline-variant ring-outline-variant/20",
    },
  ];

  const greeting = getGreeting();

  const totalPending = tasks.filter((t) => !t.completed).length;
  const highPriority = tasks.filter((t) => !t.completed && (t.priority === "P0" || t.priority === "P1")).length;
  const todayMeetingsCount = events.filter((e) => e.type === "meeting").length;

  const summaryText = `Your cognitive load is optimal. You have ${totalPending > 0 ? totalPending : 12} pending tasks, with ${highPriority > 0 ? highPriority : 3} designated as high priority. Calendar shows ${todayMeetingsCount > 0 ? todayMeetingsCount : 2} active session${todayMeetingsCount !== 1 ? 's' : ''} today. Your afternoon is clear of meetings, offering a perfect deep-work window.`;

  return (
    <div className="w-full bg-transparent">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      
      {/* Universal Hub Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 
            className="font-headline-xl text-on-surface"
            style={{ fontSize: "48px", lineHeight: "1.2", letterSpacing: "-0.02em", fontFamily: "Inter, sans-serif" }}
          >
            Universal Hub
          </h2>
          <p className="text-on-surface-variant mt-1">
            {greeting}, {user?.firstName || "Alexander"}. Your cognitive flow is at 98% today.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group w-48 md:w-64 hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="bg-surface-container-low border border-outline-variant/30 rounded-full pl-10 pr-6 py-2 w-full focus:ring-1 focus:ring-primary focus:border-primary bg-opacity-50 backdrop-blur-md outline-none transition-all font-label-sm"
              placeholder="Neural Search..."
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <NotificationBell />
            <button className="px-6 py-2 bg-white text-surface font-bold rounded-full text-label-sm hover:scale-105 transition-all">
              Ascend Now
            </button>
          </div>
        </div>
      </header>

      {/* Analytics Stat Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
        {/* Focus Hours */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <span className="material-symbols-outlined text-primary mb-4">timer</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Focus Hours</p>
            <p className="font-stat-lg text-stat-lg mt-1">
              {stats[0].value}
              <span className="text-primary text-sm ml-1">hrs</span>
            </p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <span className="material-symbols-outlined text-secondary mb-4">task_alt</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Tasks Completed</p>
            <p className="font-stat-lg text-stat-lg mt-1">{stats[1].value}</p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-primary/20">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-orange-400 mb-4">local_fire_department</span>
            <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-label-sm">
              MAX FLOW
            </span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Current Streak</p>
            <p className="font-stat-lg text-stat-lg mt-1">
              {stats[2].value} {stats[2].value === "1" ? "Day 🔥" : "Days 🔥"}
            </p>
          </div>
        </div>

        {/* Meeting Time Saved */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <span className="material-symbols-outlined text-tertiary mb-4">auto_fix_high</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Meeting Time Saved</p>
            <p className="font-stat-lg text-stat-lg mt-1">
              {stats[3].value}
              <span className="text-tertiary text-sm ml-1">hrs</span>
            </p>
          </div>
        </div>
      </section>

      {/* AI Daily Briefing & Zen Mode */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-12">
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] p-8 group border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 via-surface/80 to-tertiary-container/30 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="font-label-sm text-primary uppercase tracking-widest">AI Intelligence Brief</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">Strategic Synthesis complete.</h3>
            <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {summaryText}
            </p>
            <div className="mt-8 flex gap-4">
              <Link 
                href="/kanban" 
                className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-label-sm hover:brightness-110 transition-all text-center"
              >
                Execute Priorities
              </Link>
              <Link 
                href="/analytics" 
                className="bg-white/5 border border-white/10 px-8 py-3 rounded-full font-bold text-label-sm hover:bg-white/10 transition-all text-center"
              >
                Full Analysis
              </Link>
            </div>
          </div>
        </div>
        
        <div className="relative rounded-[2rem] p-8 overflow-hidden group border border-secondary/20 flex flex-col items-center text-center justify-center bg-surface-container-lowest">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,176,202,0.1),transparent_70%)] group-hover:scale-125 transition-transform duration-1000 pointer-events-none z-0"></div>
          <div className="relative z-10 flex flex-col items-center text-center justify-center w-full">
            <span className="material-symbols-outlined text-secondary text-5xl mb-6">self_improvement</span>
            <h4 className="font-headline-lg text-2xl text-on-surface mb-2">Zen Mode</h4>
            <p className="text-on-surface-variant mb-8 text-sm px-4">Instant neural silence. 40Hz binaural beats. Zero distractions.</p>
            <Link 
              href="/focus" 
              className="w-full py-4 bg-gradient-to-r from-secondary-container to-secondary text-on-secondary-container font-black rounded-2xl hover:shadow-[0_0_20px_rgba(255,176,202,0.3)] transition-all text-center block"
            >
              Launch Focus Session
            </Link>
          </div>
        </div>
      </section>

      {/* Task Panel & Activity Log */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Task Panel */}
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h4 className="font-headline-lg text-2xl text-on-surface">Priority Tasks</h4>
              <CreateTaskDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
                  aria-label="Create new task"
                >
                  <Plus size={14} />
                </Button>
              </CreateTaskDialog>
            </div>
            <Link href="/kanban" className="text-primary font-label-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {pendingTasksList.length > 0 ? (
              pendingTasksList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border-b border-white/5 justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={cn(
                      "w-2 h-10 rounded-full shrink-0",
                      task.priority === "P0" ? "bg-error" :
                      task.priority === "P1" ? "bg-secondary" :
                      task.priority === "P2" ? "bg-tertiary" : "bg-outline"
                    )}></div>
                    
                    <div className="min-w-0">
                      <h5 className="text-on-surface font-semibold truncate">{task.title}</h5>
                      <p className="text-xs text-on-surface-variant truncate">
                        {task.description || "Core Protocol Design • Sync required"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {task.dueDate && (
                      <span className="text-[10px] font-bold text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded">
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    )}
                    
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-label-sm uppercase font-bold",
                      task.priority === "P0" ? "bg-error-container text-on-error-container" :
                      task.priority === "P1" ? "bg-secondary-container text-on-secondary-container" :
                      task.priority === "P2" ? "bg-tertiary-container text-on-tertiary-container" :
                      "bg-surface-variant text-on-surface-variant"
                    )}>
                      {task.priority || "P2"}
                    </span>

                    {/* Action buttons (Complete & Edit) revealed on hover of row */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Check/Complete Button */}
                      <button
                        onClick={() => handleTaskToggle(task.id)}
                        className="rounded p-1 hover:bg-white/10 focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer"
                        title={task.completed ? "Mark as active" : "Mark as complete"}
                      >
                        <span className={cn("material-symbols-outlined text-base text-muted-foreground hover:text-foreground", task.completed && "text-success")}>
                          {task.completed ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingTask(task)}
                        className="rounded p-1 hover:bg-white/10 focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer"
                        title="Edit task"
                      >
                        <span className="material-symbols-outlined text-base text-muted-foreground hover:text-foreground">
                          edit
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-8 text-center flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-success flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <p className="font-medium">All caught up!</p>
                <p className="text-xs mt-1 opacity-70">Enjoy your free time</p>
                <div className="mt-4">
                  <CreateTaskDialog>
                    <Button variant="outline" size="sm" className="gap-2 border-dashed border-white/20 hover:border-brand-500 hover:text-primary hover:bg-brand-500/5">
                      <Plus size={14} />
                      Add task
                    </Button>
                  </CreateTaskDialog>
                </div>
              </div>
            )}
          </div>

          {/* Edit Task Dialog */}
          {editingTask && (
            <EditTaskDialog
              task={editingTask}
              open={!!editingTask}
              onOpenChange={(open) => !open && setEditingTask(null)}
            />
          )}
        </div>

        {/* Neural Activity Log */}
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline-lg text-2xl text-on-surface">Neural Activity Log</h4>
            <span className="material-symbols-outlined text-outline cursor-pointer">tune</span>
          </div>
          
          <div className="relative pl-8 space-y-10">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-transparent opacity-30"></div>
            
            {neuralActivityEvents.map((event, i) => (
              <div key={i} className="relative">
                <div className={cn("absolute -left-[31px] top-1 w-4 h-4 rounded-full", event.glowClass)}></div>
                <div>
                  <p className={cn("text-xs font-label-sm mb-1", 
                    event.color === "primary" ? "text-primary" :
                    event.color === "secondary" ? "text-secondary" :
                    event.color === "tertiary" ? "text-tertiary" : "text-on-surface-variant"
                  )}>
                    {event.time}
                  </p>
                  <h5 className="text-on-surface font-semibold">{event.title}</h5>
                  <p className="text-sm text-on-surface-variant mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

