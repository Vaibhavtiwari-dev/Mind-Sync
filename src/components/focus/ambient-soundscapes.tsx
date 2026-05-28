"use client";

import { useSoundscapes, NoiseType } from "@/hooks/use-soundscapes";
import { GlassCard } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { CloudRain, Wind, Waves, Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SOUNDS = [
  {
    id: "pink" as NoiseType,
    label: "Rainfall",
    description: "Soothing water droplets",
    icon: CloudRain,
    gradient: "from-blue-500/10 via-teal-500/5 to-transparent",
    iconColor: "text-blue-400 dark:text-blue-300",
    glow: "shadow-blue-500/10 border-blue-500/30",
  },
  {
    id: "white" as NoiseType,
    label: "White Noise",
    description: "Consistent masking static",
    icon: Wind,
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    iconColor: "text-purple-400 dark:text-purple-300",
    glow: "shadow-purple-500/10 border-purple-500/30",
  },
  {
    id: "brown" as NoiseType,
    label: "Deep Focus",
    description: "Low-frequency rumble",
    icon: Waves,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    iconColor: "text-amber-400 dark:text-amber-300",
    glow: "shadow-amber-500/10 border-amber-500/30",
  },
];

export function AmbientSoundscapes() {
  const { isPlaying, activeType, volume, play, stop, toggle, setVolume } = useSoundscapes();

  const handleCardClick = (type: NoiseType) => {
    if (activeType === type) {
      toggle();
    } else {
      play(type);
    }
  };

  return (
    <GlassCard className="w-full bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6" hover="none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-brand-purple/20 to-brand-pink/20 border border-white/10 shadow-inner">
            <Music className="h-5 w-5 text-brand-pink animate-pulse" />
            <div className="absolute inset-0 bg-brand-purple/20 blur-md rounded-full pointer-events-none" />
          </div>
          <div>
            <h3 className="font-semibold text-lg tracking-tight text-foreground bg-gradient-to-r from-white via-white to-white/70 bg-clip-text">
              Ambient Soundscapes
            </h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              Block distractions and stay in the zone
            </p>
          </div>
        </div>

        {isPlaying && (
          <Button
            variant="outline"
            size="sm"
            onClick={stop}
            className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 transition-all duration-300 text-xs px-4"
          >
            <VolumeX className="mr-1.5 h-3.5 w-3.5" />
            Mute All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SOUNDS.map((sound) => {
          const isActive = activeType === sound.id && isPlaying;
          const Icon = sound.icon;

          // Theme-specific range gradients
          const rangeGradient = sound.id === "pink" 
            ? "bg-gradient-to-r from-blue-500 to-teal-400"
            : sound.id === "white"
            ? "bg-gradient-to-r from-purple-500 to-pink-500"
            : "bg-gradient-to-r from-amber-500 to-orange-500";

          return (
            <div
              key={sound.id}
              onClick={() => handleCardClick(sound.id)}
              className={cn(
                "relative group cursor-pointer rounded-2xl border p-5 transition-all duration-500 flex flex-col justify-between overflow-hidden",
                "hover:-translate-y-1 hover:shadow-xl",
                isActive
                  ? cn(
                      "bg-gradient-to-br border-white/20 shadow-lg shadow-black/30 backdrop-blur-lg scale-[1.02]", 
                      sound.gradient, 
                      sound.glow
                    )
                  : "bg-white/[0.03] border-white/[0.06] hover:border-white/15 dark:bg-white/[0.01]"
              )}
            >
              {/* Top Row: Icon and Label */}
              <div className="flex items-start justify-between z-10">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-all duration-300 border",
                      isActive 
                        ? "bg-white/15 border-white/20 shadow-inner" 
                        : "bg-white/5 border-white/[0.05] group-hover:bg-white/10"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", sound.iconColor)} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground tracking-tight">{sound.label}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{sound.description}</p>
                  </div>
                </div>

                {/* Equalizer animation when playing */}
                {isActive && (
                  <div className="flex items-end gap-[3px] h-3.5 mt-1 mr-1">
                    <motion.div
                      className="w-[2.5px] bg-foreground rounded-full"
                      animate={{ height: [4, 14, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="w-[2.5px] bg-foreground rounded-full"
                      animate={{ height: [6, 10, 6] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.div
                      className="w-[2.5px] bg-foreground rounded-full"
                      animate={{ height: [3, 16, 3] }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div
                      className="w-[2.5px] bg-foreground rounded-full"
                      animate={{ height: [5, 12, 5] }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.05 }}
                    />
                  </div>
                )}
              </div>

              {/* Volume Slider Section */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full mt-6 flex items-center gap-2.5 z-10"
              >
                <button
                  onClick={() => {
                    if (isActive) {
                      setVolume(volume === 0 ? 0.5 : 0);
                    } else {
                      play(sound.id);
                    }
                  }}
                  className="hover:opacity-80 transition-opacity p-1 rounded-lg hover:bg-white/5"
                >
                  {isActive && volume > 0 ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                <Slider
                  value={[isActive ? volume : 0]}
                  max={1}
                  step={0.01}
                  onValueChange={([v]) => {
                    if (!isActive) {
                      play(sound.id);
                    }
                    setVolume(v);
                  }}
                  className="flex-1 cursor-pointer"
                  trackClassName="h-1 bg-white/10 dark:bg-white/5 overflow-hidden"
                  rangeClassName={cn(isActive ? rangeGradient : "bg-muted-foreground/30")}
                  thumbClassName="h-3 w-3 bg-white border-0 hover:scale-125 transition-transform duration-150 cursor-pointer shadow-md shadow-black/40"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-8 text-right select-none">
                  {isActive ? Math.round(volume * 100) : 0}%
                </span>
              </div>

              {/* Decorative Background Glow for Active Card */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
