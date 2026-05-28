"use client";

import dynamic from "next/dynamic";
import { PageLoadingSkeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Brain, TrendingUp } from "lucide-react";

// Dynamic import for heavy Analytics component with loading skeleton
const ProductivityDashboard = dynamic(() => import("@/components/productivity-dashboard"), {
  loading: () => <PageLoadingSkeleton />,
  ssr: false,
});

export default function AnalyticsPage() {
  return (
    <div className="relative min-h-full overflow-y-auto overflow-x-hidden p-1 sm:p-4">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 -z-10 h-[350px] w-[350px] rounded-full bg-pink-600/5 blur-[100px] pointer-events-none" />

      <GlassCard 
        className="min-h-full p-6 sm:p-8 border border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] bg-card/40 backdrop-blur-2xl" 
        hover="none"
      >
        {/* Interactive Redesigned Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-purple-500/10 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <motion.div 
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400"
              >
                <Brain className="h-5 w-5" />
              </motion.div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-purple-400/80 bg-purple-500/5 border border-purple-500/10 px-2.5 py-0.5 rounded-full">
                Synaptic Stats
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mt-2">
              Productivity Intelligence
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Track your deep focus periods, habit loops, and task completion metrics analyzed through our neural feedback engine.
            </p>
          </div>

          {/* Core Method Badge */}
          <div className="flex items-center gap-4 bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl self-start md:self-center max-w-[280px]">
            <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                Cognitive Insights <TrendingUp className="h-3 w-3 text-emerald-400" />
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Calculated based on active Pomodoro sessions, tasks, and streaks.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Components */}
        <ProductivityDashboard />
      </GlassCard>
    </div>
  );
}
