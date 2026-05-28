"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NOTE_TEMPLATES, NoteTemplate } from "@/lib/note-templates";
import { Note } from "@/store/useStore";
import { useNoteActions } from "@/store/selectors";
import {
  Users,
  UserCircle,
  Calendar,
  FileText,
  Lightbulb,
  File,
  LucideIcon,
  BookHeart,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  UserCircle,
  Calendar,
  FileText,
  Lightbulb,
  File,
  BookHeart,
};

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePicker({ isOpen, onClose }: TemplatePickerProps) {
  const router = useRouter();
  const { addNote } = useNoteActions();
  const [selectedTemplate] = useState<string | null>(null);

  const createNoteFromTemplate = (template: NoteTemplate): Note => {
    return {
      id: uuidv4(),
      title: template.name === "Blank Note" ? "Untitled Note" : template.name,
      content: template.content,
      preview: template.content.slice(0, 150) || "No content yet...",
      date: new Date().toISOString(),
      tags: [],
      type: template.type,
    };
  };

  const handleQuickCreate = (template: NoteTemplate) => {
    const newNote = createNoteFromTemplate(template);
    addNote(newNote);
    onClose();
    router.push(`/notes/${newNote.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[680px] bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border-white/10 dark:border-white/5 rounded-2xl shadow-elevated overflow-hidden p-6 animate-fade-in-up">
        {/* Glow backdrop decorative light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/20 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-2.5 pb-4 border-b border-white/10 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-primary/15 p-2 rounded-lg border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-extrabold tracking-tight gradient-text-animated">
              Select Note Template
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Choose a professional blueprint tailored for structured reflection, team syncs, standups, briefs, or begin with a blank high-tech slate.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-6 relative z-10 max-h-[420px] overflow-y-auto pr-1.5 custom-scrollbar">
          {NOTE_TEMPLATES.map((template) => {
            const Icon = ICON_MAP[template.icon] || File;
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                onClick={() => handleQuickCreate(template)}
                className={cn(
                  "group flex flex-col justify-between rounded-xl border p-4.5 text-left transition-all duration-300 hover-lift hover-glow cursor-pointer relative",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "bg-white/30 dark:bg-white/[0.01] border-white/10 hover:border-primary/30 hover:bg-white/60 dark:hover:bg-white/[0.03]"
                )}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div
                      className={cn(
                        "rounded-xl p-3.5 transition-all duration-300 group-hover:scale-110",
                        template.type === "meeting"
                          ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400 border border-blue-500/20 shadow-glow"
                          : template.type === "journal"
                          ? "bg-gradient-to-br from-purple-500/20 to-pink-500/10 text-purple-400 border border-purple-500/20 shadow-glow"
                          : "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow"
                      )}
                    >
                      <Icon className="h-5 w-5 animate-float" style={{ animationDuration: '4s' }} />
                    </div>

                    <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
                      {template.type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-sm text-foreground transition-colors duration-300 group-hover:text-primary leading-tight">
                      {template.name}
                    </p>
                    <p className="text-muted-foreground/80 text-[11px] leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors w-full">
                  <span>Manifest note</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10 dark:border-white/5 relative z-10">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl border-white/10 hover:bg-white/10 hover:text-foreground text-sm font-medium h-9.5 px-5 transition-all duration-300"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
