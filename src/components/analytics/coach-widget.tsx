"use client";

/**
 * AI Coach Insight Widget Component
 * Redesigned into an ultra-premium glassmorphic advice box with a highlighted glow structure,
 * custom inner drop-shadows, responsive typewriter animations, and elegant decorative quote elements.
 */

import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyActivity, StatsCalculator } from "@/lib/stats-calculator";
import { Sparkles, Brain, Quote, RefreshCw } from "lucide-react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useState } from "react";

interface CoachWidgetProps {
  data: DailyActivity[];
}

export function CoachWidget({ data }: CoachWidgetProps) {
  const [adviceIndex, setAdviceIndex] = useState(0);
  const message = StatsCalculator.getCoachingMessage(data);

  // Define some secondary coaching fallback insights so the user can cycle them dynamically if they click refresh
  const extraInsights = [
    message,
    "Your cognitive concentration peak falls usually in the morning. Try blocking 9:00 AM - 11:00 AM for P0 tasks to harness this focus window.",
    "Habit loops thrive on environmental triggers. Synchronize your high-priority items directly after your morning coffee ritual to build momentum.",
    "Streak stability is more vital than raw volume. A consistent 25 minutes of deep focus daily outperforms a single 3-hour burnout cycle."
  ];

  const currentAdvice = extraInsights[adviceIndex % extraInsights.length];

  const handleCycleAdvice = () => {
    setAdviceIndex((prev) => prev + 1);
  };

  return (
    <GlassCard 
      hover="shimmer" 
      className="relative overflow-hidden border border-purple-500/40 dark:border-pink-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/5 shadow-[0_0_30px_rgba(236,72,153,0.15)] rounded-2xl h-full flex flex-col justify-between p-1 transition-all duration-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.25)]"
    >
      {/* High-fidelity visual accents */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/25 rounded-full blur-[35px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-[35px] pointer-events-none" />

      {/* Futuristic Synaptic Circuit Grid Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-purple-500/10 mx-2">
        <CardTitle className="text-xs font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-400 animate-pulse" />
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent font-black tracking-widest uppercase">
            AI Coach
          </span>
        </CardTitle>
        
        <div className="flex items-center gap-2">
          {/* Refresh/cycle advice button */}
          <button 
            onClick={handleCycleAdvice}
            className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            title="Next Insight"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
          
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_8px_rgba(236,72,153,0.3)] select-none">
            <Brain className="h-2.5 w-2.5" />
            <span>Active</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center px-4 py-4">
        {/* Highlighted Inset Glass Advice Box */}
        <div className="relative rounded-xl bg-zinc-950/45 dark:bg-zinc-950/65 border border-purple-500/20 p-4 backdrop-blur-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)]">
          {/* Top Left Quote Mark */}
          <div className="absolute -top-3 -left-1 text-purple-400/30">
            <Quote className="h-7 w-7 transform rotate-180" />
          </div>
          
          {/* Typewriter animated insight text */}
          <div className="text-zinc-100 text-xs font-semibold leading-relaxed pl-4 pr-1 min-h-[4.5rem] flex items-center relative z-10">
            <TypewriterEffect key={adviceIndex} text={currentAdvice} speed={0.02} cursorColor="#ec4899" />
          </div>
          
          {/* Bottom Right Quote Mark */}
          <div className="absolute -bottom-3 right-1 text-pink-400/20">
            <Quote className="h-7 w-7" />
          </div>
        </div>
      </CardContent>

      {/* Coach signature badge */}
      <div className="px-4 pb-3 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-muted-foreground/50 select-none">
        <span>Mind-Sync Cognitive Lab</span>
        <span>Neural Advice v2.0</span>
      </div>
    </GlassCard>
  );
}
