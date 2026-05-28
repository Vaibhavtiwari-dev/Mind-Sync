"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HabitForm } from "./habit-form";

interface CreateHabitButtonProps {
  defaultTimeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function CreateHabitButton({
  defaultTimeOfDay,
  variant = "default",
  size = "default",
  className,
  label = "New Habit"
}: CreateHabitButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {className ? (
          <Button variant={variant as any} size={size} className={className}>
            <Plus className="h-4 w-4" /> {label}
          </Button>
        ) : (
          <Button className="gap-2 shadow-glow-sm hover:shadow-glow-md transition-all bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 border-none text-white font-medium">
            <Plus className="h-4 w-4" /> {label}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md border-l border-white/10 bg-zinc-950/95 backdrop-blur-2xl text-white shadow-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="p-1.5 rounded-lg bg-primary/15 text-primary">
              <Plus className="h-5 w-5 animate-pulse" />
            </span>
            Create New Habit
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Start small. Consistency is key.
          </SheetDescription>
        </SheetHeader>
        <HabitForm defaultTimeOfDay={defaultTimeOfDay} onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

