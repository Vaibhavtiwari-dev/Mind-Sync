"use client";

/**
 * Productivity Score Component
 * Composite score based on tasks, focus, streak, and goals
 * Redesigned into the Neural Quotient (NQ) consistency gauge with rich high-fidelity styling
 */

import { useMemo, useState } from "react";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Target,
  Sparkles,
  Zap
} from "lucide-react";
import { DailyActivity } from "@/lib/stats-calculator";

interface ProductivityScoreProps {
  data: DailyActivity[];
  previousPeriodData?: DailyActivity[];
  streak: number;
  totalTasks: number;
  goalsProgress?: number; // 0-100
}

export function ProductivityScore({
  data,
  previousPeriodData,
  streak,
  totalTasks,
  goalsProgress = 50,
}: ProductivityScoreProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const calculations = useMemo(() => {
    // Weights
    const TASK_WEIGHT = 0.4;
    const FOCUS_WEIGHT = 0.3;
    const STREAK_WEIGHT = 0.2;
    const GOALS_WEIGHT = 0.1;

    // Task completion score (target: 5 tasks/day average)
    const avgTasksPerDay = data.length > 0 ? totalTasks / data.length : 0;
    const taskScore = Math.min(100, (avgTasksPerDay / 5) * 100);

    // Focus score (target: 120 min/day average)
    const totalFocus = data.reduce((acc, d) => acc + d.focusMinutes, 0);
    const avgFocusPerDay = data.length > 0 ? totalFocus / data.length : 0;
    const focusScore = Math.min(100, (avgFocusPerDay / 120) * 100);

    // Streak score (target: 7+ days)
    const streakScore = Math.min(100, (streak / 7) * 100);

    // Goals score (already 0-100)
    const goalsScore = goalsProgress;

    // Weighted total
    const total =
      taskScore * TASK_WEIGHT +
      focusScore * FOCUS_WEIGHT +
      streakScore * STREAK_WEIGHT +
      goalsScore * GOALS_WEIGHT;

    return {
      score: Math.round(total),
      taskScore: Math.round(taskScore),
      focusScore: Math.round(focusScore),
      streakScore: Math.round(streakScore),
      goalsScore: Math.round(goalsScore),
    };
  }, [data, streak, totalTasks, goalsProgress]);

  const { score, taskScore, focusScore, streakScore, goalsScore } = calculations;

  // Calculate previous period score for trend
  const previousScore = useMemo(() => {
    if (!previousPeriodData || previousPeriodData.length === 0) return null;

    const prevTasks = previousPeriodData.reduce((acc, d) => acc + d.tasksCompleted, 0);
    const avgTasksPerDay = prevTasks / previousPeriodData.length;
    const taskScore = Math.min(100, (avgTasksPerDay / 5) * 100);

    const totalFocus = previousPeriodData.reduce((acc, d) => acc + d.focusMinutes, 0);
    const avgFocusPerDay = totalFocus / previousPeriodData.length;
    const focusScore = Math.min(100, (avgFocusPerDay / 120) * 100);

    // Assume similar streak and goals for previous period
    return Math.round(taskScore * 0.4 + focusScore * 0.3 + 50 * 0.3);
  }, [previousPeriodData]);

  const trend = previousScore ? score - previousScore : 0;
  const TrendIcon = trend > 2 ? TrendingUp : trend < -2 ? TrendingDown : Minus;
  
  const trendColor =
    trend > 2 
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
      : trend < -2 
        ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
        : "text-muted-foreground bg-zinc-500/10 border-zinc-500/20";

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-purple-400";
    if (s >= 60) return "text-fuchsia-400";
    if (s >= 40) return "text-pink-400";
    return "text-indigo-400";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Hyper-Focus Mode";
    if (s >= 60) return "Synchronized Flow";
    if (s >= 40) return "Optimal Balance";
    return "Consolidating Synapses";
  };

  // SVG Radial circle mathematics
  const radius = 52;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <GlassCard 
      hover="glow" 
      className="relative overflow-hidden border border-purple-500/20 dark:border-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.12)] bg-card/40 backdrop-blur-2xl rounded-2xl p-1"
    >
      {/* Visual background atmospheric lights */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/10 blur-[40px] pointer-events-none" />

      <CardHeader className="pb-2 border-b border-purple-500/10 mb-4 mx-2">
        <CardTitle className="text-muted-foreground flex items-center justify-between text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-2">
            <Brain className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent font-extrabold uppercase tracking-widest text-[11px]">
              Neural Quotient
            </span>
          </div>
          <span className="text-[10px] text-purple-400/80 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
            NQ-v1.4
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-6 px-4">
        {/* Futuristic Radial Gauge */}
        <div className="relative flex items-center justify-center w-40 h-40 group cursor-pointer">
          <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 128 128">
            {/* SVG Glowing drop filter */}
            <defs>
              <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <linearGradient id="nq-radial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
                <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
                <stop offset="100%" stopColor="#6366f1" /> {/* Indigo */}
              </linearGradient>
            </defs>

            {/* High-tech Dashed Cybernetic outer track */}
            <circle
              cx="64"
              cy="64"
              r={radius + 6}
              className="stroke-purple-500/10"
              strokeWidth="1"
              strokeDasharray="4, 4"
              fill="transparent"
            />

            {/* Background solid track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-zinc-200/40 dark:stroke-zinc-800/60"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Gradient progress circle with drop-shadow neon glow */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#nq-radial-gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
              filter="url(#gauge-glow)"
              className="transition-all duration-300 group-hover:stroke-[8px]"
            />

            {/* Inner dynamic pulsing tick circle */}
            <circle
              cx="64"
              cy="64"
              r={radius - 6}
              className="stroke-pink-500/15 animate-pulse"
              strokeWidth="1.5"
              strokeDasharray="2, 6"
              fill="transparent"
            />
          </svg>

          {/* Central Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.div 
              className="flex items-center justify-center relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* JetBrains Mono typography for high precision */}
              <span className="font-mono text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                {score}
              </span>
              <Zap className="h-3.5 w-3.5 text-pink-400 absolute -top-2.5 -right-3 animate-bounce" />
            </motion.div>
            
            <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/80 mt-1 flex items-center gap-1">
              Consistency Index
            </span>
          </div>
        </div>

        {/* NQ Status & Dynamic Trend Card */}
        <div className="flex flex-col items-center space-y-2.5 w-full text-center">
          <div className="text-sm font-bold tracking-wide flex items-center gap-1.5 justify-center">
            <span className="text-muted-foreground/80">Cognitive State:</span>
            <span className={`font-extrabold underline decoration-2 decoration-purple-500/30 ${getScoreColor(score)}`}>
              {getLabel(score)}
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            {trend !== 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-all ${trendColor}`}
              >
                <TrendIcon className="h-3 w-3" />
                <span>
                  {trend > 0 ? "+" : ""}
                  {trend}% shift in synaptic consistency
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* High-Fidelity Sub-Metrics Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3.5 w-full border-t border-purple-500/10 pt-4.5">
          <motion.div 
            onHoverStart={() => setHoveredMetric("tasks")}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`flex flex-col p-3 rounded-xl transition-all duration-300 border ${
              hoveredMetric === "tasks" 
                ? "bg-purple-500/10 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]" 
                : "bg-zinc-500/5 border-zinc-200/5 dark:border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                Tasks (40%)
              </span>
              <span className="text-xs font-black text-purple-300 font-mono">{taskScore}%</span>
            </div>
            <Progress value={taskScore} variant="gradient" className="h-1.5" />
          </motion.div>

          <motion.div 
            onHoverStart={() => setHoveredMetric("focus")}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`flex flex-col p-3 rounded-xl transition-all duration-300 border ${
              hoveredMetric === "focus" 
                ? "bg-pink-500/10 border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.15)]" 
                : "bg-zinc-500/5 border-zinc-200/5 dark:border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                <Clock className="h-3.5 w-3.5 text-pink-400" />
                Focus (30%)
              </span>
              <span className="text-xs font-black text-pink-300 font-mono">{focusScore}%</span>
            </div>
            <Progress value={focusScore} variant="gradient" className="h-1.5" />
          </motion.div>

          <motion.div 
            onHoverStart={() => setHoveredMetric("streak")}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`flex flex-col p-3 rounded-xl transition-all duration-300 border ${
              hoveredMetric === "streak" 
                ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                : "bg-zinc-500/5 border-zinc-200/5 dark:border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Streak (20%)
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">{streakScore}%</span>
            </div>
            <Progress value={streakScore} variant="gradient" className="h-1.5" />
          </motion.div>

          <motion.div 
            onHoverStart={() => setHoveredMetric("goals")}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`flex flex-col p-3 rounded-xl transition-all duration-300 border ${
              hoveredMetric === "goals" 
                ? "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]" 
                : "bg-zinc-500/5 border-zinc-200/5 dark:border-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-bold">
                <Target className="h-3.5 w-3.5 text-indigo-400" />
                Goals (10%)
              </span>
              <span className="text-xs font-black text-indigo-300 font-mono">{goalsScore}%</span>
            </div>
            <Progress value={goalsScore} variant="gradient" className="h-1.5" />
          </motion.div>
        </div>

        {/* Small motivational quote */}
        <div className="w-full text-center text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1 pt-1 italic">
          <Sparkles className="h-3 w-3 text-purple-400/50" />
          Habit consistency matches neural pathway growth.
        </div>
      </CardContent>
    </GlassCard>
  );
}
