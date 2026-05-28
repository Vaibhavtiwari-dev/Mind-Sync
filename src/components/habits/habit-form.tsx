"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHabitSchema, type CreateHabitInput } from "@/lib/validation";
import { createHabit, updateHabit } from "@/actions/habits";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetFooter } from "@/components/ui/sheet";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HabitFormProps {
  initialData?: Partial<CreateHabitInput> & { id: string; title: string };
  defaultTimeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  onSuccess?: () => void;
}

export function HabitForm({ initialData, defaultTimeOfDay, onSuccess }: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          frequency: initialData.frequency || "daily",
          targetCount: initialData.targetCount || 1,
          timeOfDay: initialData.timeOfDay || "anytime",
          reminderTime: initialData.reminderTime || "",
        }
      : {
          id: uuidv4(),
          title: "",
          description: "",
          frequency: "daily",
          targetCount: 1,
          timeOfDay: defaultTimeOfDay || "anytime",
          reminderTime: "",
        },
  });

  const selectedFrequency = form.watch("frequency");
  const selectedTimeOfDay = form.watch("timeOfDay");

  async function onSubmit(data: Record<string, any>) {
    setIsSubmitting(true);
    try {
      const payload = { ...data } as any;

      // Clean empty values to prevent Zod validation errors on backend
      if (!payload.reminderTime || payload.reminderTime === "") {
        delete payload.reminderTime;
      }
      if (!payload.description || payload.description.trim() === "") {
        delete payload.description;
      }

      let result;
      if (isEditing) {
        result = await updateHabit({ ...payload, id: initialData.id });
      } else {
        result = await createHabit(payload);
      }

      if (result.success) {
        toast.success(isEditing ? "Habit updated! ✨" : "Habit created! 🎉");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save habit");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const timeOfDayOptions = [
    { id: "morning", label: "Morning", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", icon: "☀️" },
    { id: "evening", label: "Evening", icon: "🌙" },
    { id: "anytime", label: "Anytime", icon: "✨" },
  ];

  const frequencyOptions = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
  ];

  const activeTimeOfDayThemes = {
    morning: "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/50 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    afternoon: "bg-gradient-to-br from-sky-500/20 to-blue-500/10 border-sky-500/50 text-sky-300 font-bold shadow-[0_0_15px_rgba(14,165,233,0.2)]",
    evening: "bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border-violet-500/50 text-violet-300 font-bold shadow-[0_0_15px_rgba(139,92,246,0.25)]",
    anytime: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2 text-white">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Habit Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-zinc-900/50 border-white/5 focus:border-violet-500/40 focus:bg-zinc-900/80 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-white placeholder-zinc-500 h-11 transition-all duration-300 font-medium"
                  placeholder="e.g., Drink Water, Read Book, Gym..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-zinc-900/50 border-white/5 focus:border-violet-500/40 focus:bg-zinc-900/80 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-white placeholder-zinc-500 resize-none h-20 transition-all duration-300 font-medium text-sm leading-relaxed"
                  placeholder="What is your purpose or trigger for this habit?"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Custom Frequency Select Button-Grid */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Frequency</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {frequencyOptions.map((opt) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      field.onChange(opt.id);
                      if (opt.id === "daily") {
                        form.setValue("targetCount", 1);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm",
                      selectedFrequency === opt.id
                        ? "bg-gradient-to-r from-violet-600/30 to-pink-600/30 border-violet-500/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                        : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-800/40 hover:border-white/10"
                    )}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Weekly Target Count (Conditionally rendered) */}
        {selectedFrequency === "weekly" && (
          <FormField
            control={form.control}
            name="targetCount"
            render={({ field }) => (
              <FormItem className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Target Times per Week</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    className="bg-zinc-900/50 border-white/5 focus:border-violet-500/40 focus:bg-zinc-900/80 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-white placeholder-zinc-500 h-11 transition-all duration-300 font-semibold"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        )}

        {/* Custom Time of Day Button-Grid */}
        <FormField
          control={form.control}
          name="timeOfDay"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Time of Day</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {timeOfDayOptions.map((opt) => {
                  const isActive = selectedTimeOfDay === opt.id;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={opt.id}
                      type="button"
                      onClick={() => field.onChange(opt.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border gap-2 text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm min-h-[84px]",
                        isActive
                          ? activeTimeOfDayThemes[opt.id as keyof typeof activeTimeOfDayThemes]
                          : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-800/40 hover:border-white/10"
                      )}
                    >
                      <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reminderTime"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-zinc-400">Reminder Time (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="bg-zinc-900/50 border-white/5 focus:border-violet-500/40 focus:bg-zinc-900/80 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-white placeholder-zinc-500 h-11 transition-all duration-300 font-medium"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <SheetFooter className="pt-4 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : isEditing ? (
              "Update Habit"
            ) : (
              "Create Habit"
            )}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
