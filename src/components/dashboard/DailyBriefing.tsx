"use client";

/**
 * Daily Briefing Card
 * AI-powered daily overview for the dashboard
 */

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  RefreshCw,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { generateDailyBriefing, type DailyBriefing } from "@/actions/daily-briefing";
import { motion, AnimatePresence } from "framer-motion";

export function DailyBriefingCard() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateDailyBriefing();
      if (result.success) {
        setBriefing(result.data);
      } else {
        setError(result.error || "Failed to generate briefing");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if already dismissed today
    const dismissedDate = localStorage.getItem("briefing-dismissed");
    if (dismissedDate === new Date().toDateString()) {
      setDismissed(true);
      return;
    }
    fetchBriefing();
  }, [fetchBriefing]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("briefing-dismissed", new Date().toDateString());
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-brand-purple via-brand-pink to-brand-blue dark:from-brand-purple/20 dark:via-brand-pink/10 dark:to-brand-blue/20 dark:border dark:border-purple-500/30 text-white shadow-xl shadow-purple-500/20 dark:shadow-none animate-gradient-shift bg-[size:200%_200%]">
          {/* Glass mesh gradient overlay for depth */}
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-[2px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none animate-shimmer-sweep" />

          <CardHeader className="flex flex-row items-start justify-between pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-purple-500/20 border border-white/20 dark:border-purple-500/35 backdrop-blur-md transition-transform duration-300 hover:rotate-12">
                <Sparkles className="h-5 w-5 text-white dark:text-purple-300 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-lg font-extrabold tracking-tight text-white">Daily Briefing</CardTitle>
                {briefing && (
                  <p className="text-purple-100/90 dark:text-purple-300 text-xs mt-0.5 font-medium">{briefing.greeting}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 dark:text-purple-300 dark:hover:text-white dark:hover:bg-purple-500/25 rounded-lg"
                onClick={fetchBriefing}
                disabled={loading}
                aria-label="Refresh briefing"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 dark:text-purple-300 dark:hover:text-white dark:hover:bg-purple-500/25 rounded-lg"
                onClick={handleDismiss}
                aria-label="Dismiss briefing"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-0 pb-6 relative z-10">
            {loading && !briefing && (
              <div className="space-y-3 py-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10 dark:bg-white/5" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10 dark:bg-white/5" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10 dark:bg-white/5" />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-100 text-sm">
                {error}
              </div>
            )}

            {briefing && (
              <>
                {/* Stats row */}
                <div className="flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 dark:bg-white/[0.04] text-white dark:text-purple-100 border border-white/15 dark:border-white/[0.08] backdrop-blur-md text-xs font-semibold shadow-sm transition-all duration-300 hover:bg-white/15">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300 dark:text-cyan-400" />
                    {briefing.stats.totalTasks} tasks
                  </span>
                  {briefing.stats.overdueTasks > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 dark:bg-red-950/30 text-white dark:text-red-300 border border-red-500/30 text-xs font-semibold shadow-sm animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-200 dark:text-red-400" />
                      {briefing.stats.overdueTasks} overdue
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 dark:bg-white/[0.04] text-white dark:text-purple-100 border border-white/15 dark:border-white/[0.08] backdrop-blur-md text-xs font-semibold shadow-sm transition-all duration-300 hover:bg-white/15">
                    <Calendar className="h-3.5 w-3.5 text-cyan-300 dark:text-cyan-400" />
                    {briefing.stats.todayEvents} events
                  </span>
                </div>

                {/* Priorities */}
                {briefing.priorities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-300 dark:text-cyan-400" />
                      Top Priorities
                    </h4>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {briefing.priorities.map((p, i) => (
                        <li key={i} className="text-sm text-purple-50/90 dark:text-purple-200/90 flex items-start gap-3 bg-white/10 dark:bg-white/[0.03] border border-white/10 dark:border-white/[0.05] p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/[0.06] hover:scale-[1.01] shadow-sm">
                          <span className="text-cyan-300 dark:text-cyan-400 font-extrabold shrink-0 bg-white/15 rounded-lg h-5 w-5 flex items-center justify-center text-[10px]">{i + 1}</span>
                          <span className="leading-snug">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Schedule */}
                <div className="bg-white/10 dark:bg-white/[0.03] border border-white/10 dark:border-white/[0.05] p-4 rounded-xl backdrop-blur-sm space-y-2 shadow-sm">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cyan-300 dark:text-cyan-400" />
                    Schedule Overview
                  </h4>
                  <p className="text-sm text-purple-50/90 dark:text-purple-200/90 leading-relaxed font-medium">{briefing.scheduleOverview}</p>
                </div>

                {/* Suggestions */}
                {briefing.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-cyan-300 dark:text-cyan-400" />
                      Tips & Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {briefing.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-purple-50/95 dark:text-purple-200/95 flex items-start gap-3 bg-white/10 dark:bg-white/[0.03] border border-white/10 dark:border-white/[0.05] p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/[0.06] hover:scale-[1.01] shadow-sm">
                          <span className="shrink-0 bg-white/15 h-6 w-6 rounded-full flex items-center justify-center text-xs">💡</span>
                          <span className="leading-snug">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Motivational note */}
                <p className="text-xs text-purple-200/70 dark:text-purple-300/60 italic border-t border-white/10 dark:border-purple-500/20 pt-3 mt-4">
                  {briefing.motivationalNote}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
