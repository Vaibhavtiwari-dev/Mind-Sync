"use client";

/**
 * Focus Timer Component
 * Pomodoro-style focus timer with visual progress
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Coffee,
  Target,
  Zap,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { TimerMode } from "@/store/useStore";
import { useTasks, useTimerState, useTimerActions, useNotificationActions } from "@/store/selectors";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/audio-player";
import { Maximize2, Minimize2 } from "lucide-react";
import { BELL_SOUND } from "@/lib/sounds";

const modeConfig = {
  focus: {
    label: "Focus",
    color: "text-brand-pink",
    bgColor: "bg-brand-pink",
    ringColor: "ring-brand-pink",
    icon: Target,
  },
  shortBreak: {
    label: "Short Break",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400",
    ringColor: "ring-emerald-400",
    icon: Coffee,
  },
  longBreak: {
    label: "Long Break",
    color: "text-brand-blue",
    bgColor: "bg-brand-blue",
    ringColor: "ring-brand-blue",
    icon: Zap,
  },
};

export function FocusTimer() {
  const tasks = useTasks();
  const {
    timerMode,
    timeLeft,
    isTimerRunning,
    completedSessions,
    timerSettings,
    activeTaskId,
  } = useTimerState();
  const {
    setTimerMode,
    setTimerRunning,
    tickTimer,
    updateTimerSettings,
    incrementCompletedSessions,
    setActiveTimerTask,
    resetTimer,
  } = useTimerActions();
  const { addNotification } = useNotificationActions();

  const [zenMode, setZenMode] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    if (typeof Worker !== "undefined") {
      workerRef.current = new Worker("/timer-worker.js");
      workerRef.current.onmessage = (e) => {
        if (e.data === "tick") {
          tickTimer();
        }
      };
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, [tickTimer]);

  // Handle Timer Start/Stop with Worker
  useEffect(() => {
    if (workerRef.current) {
      if (isTimerRunning) {
        workerRef.current.postMessage("start");
      } else {
        workerRef.current.postMessage("stop");
      }
    }
  }, [isTimerRunning]);

  const getDuration = (mode: TimerMode) => {
    switch (mode) {
      case "focus":
        return timerSettings.focusDuration * 60;
      case "shortBreak":
        return timerSettings.shortBreakDuration * 60;
      case "longBreak":
        return timerSettings.longBreakDuration * 60;
    }
  };

  const playSound = useCallback(() => {
    if (timerSettings.soundEnabled && typeof window !== "undefined") {
      // Use built-in sound for reliability
      const audio = new Audio(BELL_SOUND);
      audio.volume = 0.5;
      audio.play().catch((e) => console.warn("Audio play failed", e));
    }
  }, [timerSettings.soundEnabled]);

  const showNotification = (title: string, body: string) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body, icon: "/favicon.ico" });
          }
        });
      }
    }
  };

  // Timer Completion Logic
  useEffect(() => {
    if (timeLeft === 0 && isTimerRunning) {
      setTimerRunning(false);
      playSound();

      if (timerMode === "focus") {
        incrementCompletedSessions();

        const curSessions = completedSessions + 1;
        const nextMode =
          curSessions % timerSettings.sessionsBeforeLongBreak === 0 ? "longBreak" : "shortBreak";

        setTimerMode(nextMode);

        const title = "Focus session complete!";
        const message = nextMode === "longBreak" ? "Time for a long break!" : "Take a short break.";

        showNotification(title, message);
        toast.success(title);

        // Add to in-app notifications
        addNotification({
          title,
          message,
          type: "success",
        });

        if (timerSettings.autoStartBreaks) {
          setTimerRunning(true);
        }
      } else {
        setTimerMode("focus");
        showNotification("Break over!", "Ready to focus?");
        toast.info("Break over! Ready to focus?");

        if (timerSettings.autoStartFocus) {
          setTimerRunning(true);
        }
      }
    }
  }, [
    timeLeft,
    isTimerRunning,
    timerMode,
    completedSessions,
    timerSettings,
    incrementCompletedSessions,
    setTimerMode,
    setTimerRunning,
    addNotification,
    playSound,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = getDuration(timerMode);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const currentConfig = modeConfig[timerMode];
  const Icon = currentConfig.icon;

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <>
      <div
        className={cn(
          "mx-auto w-full transition-all duration-500",
          zenMode
            ? "bg-background/95 fixed inset-0 z-[100] flex h-screen w-screen max-w-none flex-col items-center justify-center rounded-none backdrop-blur-md p-6"
            : "w-full bg-transparent"
        )}
      >
        <div className="relative mx-auto w-full max-w-md pb-4 text-center">
          {/* Zen Mode Toggle */}
          {zenMode && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setZenMode(false)}
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center justify-between gap-4">
            {!zenMode && (
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Icon className={cn("h-5 w-5", currentConfig.color)} />
                {currentConfig.label}
              </h2>
            )}

            <div className={cn("flex items-center", zenMode ? "mx-auto" : "")}>
              <AudioPlayer />
            </div>

            {!zenMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/10"
                  onClick={() => setZenMode(true)}
                  title="Zen Mode"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/10"
                  onClick={() => updateTimerSettings({ soundEnabled: !timerSettings.soundEnabled })}
                >
                  {timerSettings.soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Timer Settings</h4>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <Label>Focus Duration</Label>
                          <span>{timerSettings.focusDuration} min</span>
                        </div>
                        <Slider
                          value={[timerSettings.focusDuration]}
                          onValueChange={([v]) => updateTimerSettings({ focusDuration: v })}
                          min={5}
                          max={60}
                          step={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <Label>Short Break</Label>
                          <span>{timerSettings.shortBreakDuration} min</span>
                        </div>
                        <Slider
                          value={[timerSettings.shortBreakDuration]}
                          onValueChange={([v]) => updateTimerSettings({ shortBreakDuration: v })}
                          min={1}
                          max={15}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <Label>Long Break</Label>
                          <span>{timerSettings.longBreakDuration} min</span>
                        </div>
                        <Slider
                          value={[timerSettings.longBreakDuration]}
                          onValueChange={([v]) => updateTimerSettings({ longBreakDuration: v })}
                          min={10}
                          max={30}
                          step={5}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <Label className="text-xs">Auto-start breaks</Label>
                        <Switch
                          checked={timerSettings.autoStartBreaks}
                          onCheckedChange={(v) => updateTimerSettings({ autoStartBreaks: v })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Auto-start focus</Label>
                        <Switch
                          checked={timerSettings.autoStartFocus}
                          onCheckedChange={(v) => updateTimerSettings({ autoStartFocus: v })}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="bg-white/5 dark:bg-black/20 border border-white/5 mt-4 flex gap-1 rounded-xl p-1">
            {(Object.keys(modeConfig) as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setTimerMode(m)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-300",
                  timerMode === m
                    ? "bg-white/15 dark:bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {modeConfig[m].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 pt-2">
          {/* Task Selection */}
          {timerMode === "focus" && (
            <div className="w-full">
              <Select
                value={activeTaskId || "none"}
                onValueChange={(val) => setActiveTimerTask(val === "none" ? null : val)}
              >
                <SelectTrigger className="bg-white/5 border border-white/10 w-full rounded-xl">
                  <SelectValue placeholder="Select a task to focus on..." />
                </SelectTrigger>
                <SelectContent className="bg-card/95 border border-white/10 rounded-xl backdrop-blur-xl">
                  <SelectItem value="none">-- No active task --</SelectItem>
                  {incompleteTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      <span className="flex items-center gap-2">
                        {task.priority === "P0" && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                        <span className="max-w-[200px] truncate">{task.title}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Timer Circle */}
          <div
            data-testid="timer-display"
            data-status={isTimerRunning ? "running" : "paused"}
            data-mode={timerMode}
            className={cn(
              "relative mx-auto transition-all duration-500 flex items-center justify-center",
              zenMode ? "h-[420px] w-[420px] scale-105" : "h-72 w-72 sm:h-80 sm:w-80 md:h-[350px] md:w-[350px]"
            )}
          >
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="gradient-focus" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                  <stop offset="50%" stopColor="hsl(330, 81%, 60%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                </linearGradient>
                <linearGradient id="gradient-shortBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(142, 76%, 45%)" />
                  <stop offset="100%" stopColor="hsl(172, 66%, 50%)" />
                </linearGradient>
                <linearGradient id="gradient-longBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                  <stop offset="100%" stopColor="hsl(199, 89%, 50%)" />
                </linearGradient>
                <filter id="timer-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Outer Precision Ticks (Rotating) */}
              <circle
                cx="140"
                cy="140"
                r="132"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 10"
                className={cn(
                  "text-white/10 transition-all duration-1000",
                  isTimerRunning ? "animate-[spin_240s_linear_infinite]" : ""
                )}
              />

              {/* Background circular track */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-white/[0.04] dark:text-white/[0.03]"
              />
              
              {/* Glow Behind (Only when running) */}
              {isTimerRunning && (
                <motion.circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke={`url(#gradient-${timerMode})`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.35"
                  filter="url(#timer-glow)"
                  strokeDasharray={754}
                  initial={{ strokeDashoffset: 754 }}
                  animate={{
                    strokeDashoffset: 754 - (progress / 100) * 754,
                  }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
              )}

              {/* Main Progress Stroke */}
              <motion.circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke={`url(#gradient-${timerMode})`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={754}
                initial={{ strokeDashoffset: 754 }}
                animate={{
                  strokeDashoffset: 754 - (progress / 100) * 754,
                }}
                transition={{ duration: 0.5, ease: "linear" }}
              />

              {/* Inner Decorative Dashboard Ring */}
              <circle
                cx="140"
                cy="140"
                r="108"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 6"
                className="text-white/5 dark:text-white/[0.02]"
              />
            </svg>

            {/* Centered Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 select-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={timeLeft}
                  initial={{ opacity: 0.6, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "font-extrabold tracking-tight font-mono bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
                    timerMode === "focus"
                      ? "from-purple-400 via-pink-400 to-blue-400"
                      : timerMode === "shortBreak"
                      ? "from-emerald-400 to-teal-400"
                      : "from-blue-400 to-cyan-400",
                    zenMode ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl md:text-8xl"
                  )}
                >
                  {formatTime(timeLeft)}
                </motion.span>
              </AnimatePresence>
              
              <span className={cn(
                "mt-3 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500",
                timerMode === "focus" 
                  ? "text-brand-pink" 
                  : timerMode === "shortBreak" 
                  ? "text-emerald-400" 
                  : "text-brand-blue"
              )}>
                {timerMode === "focus" ? "Focus Session" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
              </span>

              <span data-testid="session-count" className="text-muted-foreground/60 mt-1 text-[10px] sm:text-xs font-medium">
                Session {completedSessions + 1} of {timerSettings.sessionsBeforeLongBreak}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 z-10 relative">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-90 transition-all duration-300 shadow-md"
              onClick={resetTimer}
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              className={cn(
                "rounded-full shadow-xl transition-all duration-500 active:scale-95 hover:shadow-primary/30 flex items-center justify-center",
                zenMode ? "h-20 w-20" : "h-16 w-16",
                isTimerRunning
                  ? "bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue text-white border-0 hover:opacity-90"
                  : "bg-white text-black hover:bg-white/90"
              )}
              onClick={() => setTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? (
                <Pause className={cn("fill-current", zenMode ? "h-8 w-8" : "h-6 w-6")} />
              ) : (
                <Play className={cn("ml-1 fill-current", zenMode ? "h-8 w-8" : "h-6 w-6")} />
              )}
            </Button>

            {!zenMode && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-90 transition-all duration-300 shadow-md"
                onClick={() => setZenMode(true)}
                title="Zen Mode"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            {zenMode && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-90 transition-all duration-300 shadow-md"
                onClick={() => setZenMode(false)}
                title="Exit Zen Mode"
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Sessions indicator */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: timerSettings.sessionsBeforeLongBreak }).map((_, i) => {
              const isActive = i < completedSessions % timerSettings.sessionsBeforeLongBreak;
              return (
                <div
                  key={i}
                  className={cn(
                    "h-3 w-3 rounded-full border transition-all duration-500",
                    isActive
                      ? "bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue border-transparent scale-110 shadow-glow"
                      : "border-white/20 bg-white/5"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
      {/* Background Dimmer for Zen Mode */}
      {zenMode && <div className="bg-background/95 fixed inset-0 z-40 backdrop-blur-md" />}
    </>
  );
}
