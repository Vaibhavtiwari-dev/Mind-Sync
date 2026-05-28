"use client";

/**
 * Enhanced Activity Heatmap Component
 * Redesigned into a professional 53-week GitHub-style contribution grid with purple/pink gradients,
 * day labels, responsive layout, hover scale feedback, and premium translucent tooltips.
 */

import { eachDayOfInterval, endOfYear, format, startOfYear, isSameDay } from "date-fns";
import { DailyActivity } from "@/lib/stats-calculator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Calendar, Info } from "lucide-react";

interface EnhancedActivityHeatmapProps {
  data: DailyActivity[];
}

export function EnhancedActivityHeatmap({ data }: EnhancedActivityHeatmapProps) {
  const today = new Date();
  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);

  // Get all days of the current year
  const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Calculate averages for contextual comparison inside tooltips
  const avgTasks =
    data.length > 0 ? data.reduce((acc, d) => acc + d.focusMinutes, 0) > 0 
      ? data.reduce((acc, d) => acc + d.tasksCompleted, 0) / data.length 
      : 0 
    : 0;

  const avgFocus =
    data.length > 0 ? data.reduce((acc, d) => acc + d.focusMinutes, 0) / data.length : 0;

  const getActivity = (day: Date) => {
    return (
      data.find((d) => isSameDay(d.date, day)) || {
        date: day,
        tasksCompleted: 0,
        focusMinutes: 0,
      }
    );
  };

  const getIntensity = (day: Date) => {
    const activity = getActivity(day);
    const score = activity.tasksCompleted + activity.focusMinutes / 30;
    if (score === 0) return 0;
    if (score < 2) return 1;
    if (score < 4) return 2;
    if (score < 6) return 3;
    return 4;
  };

  // Redesigned with premium purple-to-pink gradients
  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/10 dark:border-zinc-700/20";
      case 1:
        return "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/20 text-purple-400";
      case 2:
        return "bg-gradient-to-br from-purple-500/40 to-fuchsia-500/40 border border-purple-500/30 text-fuchsia-300";
      case 3:
        return "bg-gradient-to-br from-purple-500/70 to-pink-500/70 border border-fuchsia-500/40 text-pink-300";
      case 4:
        return "bg-gradient-to-br from-purple-500 to-pink-500 border border-pink-400/50 shadow-[0_0_10px_rgba(236,72,153,0.45)] text-white";
      default:
        return "bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/10 dark:border-zinc-700/20";
    }
  };

  const getComparisonText = (value: number, avg: number) => {
    if (avg === 0) return "First of year";
    const diff = ((value - avg) / avg) * 100;
    if (Math.abs(diff) < 5) return "On par with avg";
    if (diff > 0) return `+${diff.toFixed(0)}% vs avg`;
    return `${diff.toFixed(0)}% vs avg`;
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Legend & Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-purple-500/10 pb-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-purple-400" />
          <span>Interactive Synaptic Pulse Map</span>
          <span title="Hover over cells to examine completed tasks & focus periods.">
            <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <span className="text-[10px]">Lull</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div 
              key={level} 
              className={`h-3 w-3 rounded-sm ${getColor(level)} transition-all duration-300`} 
            />
          ))}
          <span className="text-[10px]">Peak</span>
        </div>
      </div>

      <div className="flex select-none">
        {/* Day of Week Labels on the Left Side */}
        <div className="flex flex-col justify-between text-[9px] font-bold text-muted-foreground/80 pr-2 pb-1.5 w-7 mt-[14px]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* The 53-Week Grid */}
        <div className="flex-1 overflow-x-auto pb-3 custom-scrollbar">
          <div className="flex gap-1.25 min-w-max">
            {Array.from({ length: 53 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.25">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dayOfYearIndex = weekIndex * 7 + dayIndex;
                  const day = days[dayOfYearIndex];
                  
                  // Render empty box for dates that are out of scope (future or past start)
                  if (!day || day > today) {
                    return (
                      <div 
                        key={dayIndex} 
                        className="h-3.5 w-3.5 rounded-sm bg-transparent" 
                      />
                    );
                  }

                  const intensity = getIntensity(day);
                  const activity = getActivity(day);

                  return (
                    <TooltipProvider key={day.toISOString()} delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className={`h-3.5 w-3.5 rounded-sm ${getColor(intensity)} cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-purple-400`}
                          />
                        </TooltipTrigger>
                        
                        <TooltipContent side="top" className="p-0 border-0 bg-transparent shadow-none">
                          {/* Beautiful Glassmorphism Dark Tooltip Box */}
                          <div className="bg-zinc-950/95 backdrop-blur-xl min-w-[210px] rounded-xl border border-purple-500/30 p-3.5 text-xs shadow-[0_0_20px_rgba(168,85,247,0.25)] text-zinc-100">
                            <div className="text-white font-extrabold mb-2.5 border-b border-purple-500/20 pb-2 flex items-center justify-between gap-4">
                              <span className="font-mono">{format(day, "MMM d, yyyy")}</span>
                              <span className="text-[9px] uppercase font-black text-purple-300 bg-purple-500/25 border border-purple-500/30 px-2 py-0.5 rounded-full">
                                {format(day, "EEEE")}
                              </span>
                            </div>

                            {activity.tasksCompleted === 0 && activity.focusMinutes === 0 ? (
                              <p className="text-muted-foreground text-center py-1.5 italic">No synaptic activities logged</p>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                    Tasks Completed:
                                  </span>
                                  <span className="font-extrabold text-white">
                                    {activity.tasksCompleted}
                                    <span className="text-[10px] text-purple-400 ml-1.5 font-bold">
                                      ({getComparisonText(activity.tasksCompleted, avgTasks)})
                                    </span>
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                                    Deep Focus Time:
                                  </span>
                                  <span className="font-extrabold text-white">
                                    {activity.focusMinutes} min
                                    <span className="text-[10px] text-pink-400 ml-1.5 font-bold">
                                      ({getComparisonText(activity.focusMinutes, avgFocus)})
                                    </span>
                                  </span>
                                </div>

                                {/* Dynamic Visual Accent Intensity Indicator */}
                                <div className="border-t border-purple-500/20 pt-2.5 mt-1">
                                  <div className="text-muted-foreground mb-1.5 flex justify-between text-[10px] font-bold">
                                    <span>Cognitive State Intensity</span>
                                    <span className="text-purple-300">{["Dormant", "Low Spark", "Moderate Flow", "High Charge", "Superconductive"][intensity]}</span>
                                  </div>
                                  <div className="bg-zinc-800/80 h-1.5 overflow-hidden rounded-full border border-white/5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(intensity / 4) * 100}%` }}
                                      transition={{ duration: 0.3 }}
                                      className={`h-full bg-gradient-to-r from-purple-500 to-pink-500`}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Month Labels aligned beneath the grid */}
      <div className="text-muted-foreground/80 flex text-[10px] font-bold border-t border-purple-500/10 pt-2 w-full select-none">
        <div className="w-7 pr-2" /> {/* alignment spacer */}
        <div className="flex-1 flex justify-between px-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (month) => (
              <span key={month} className="text-center font-mono">
                {month}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
