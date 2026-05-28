"use client";

import { useRouter } from "next/navigation";
import { useNoteActions } from "@/store/selectors";
import { NOTE_TEMPLATES, NoteTemplate } from "@/lib/note-templates";
import { 
  StickyNote, 
  Sparkles, 
  BookHeart, 
  Users, 
  UserCircle, 
  Calendar, 
  FileText, 
  Lightbulb, 
  File, 
  Compass,
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookHeart,
  Users,
  UserCircle,
  Calendar,
  FileText,
  Lightbulb,
  File,
};

export default function NotesIndexPage() {
  const router = useRouter();
  const { addNote } = useNoteActions();

  const handleCreateFromTemplate = (template: NoteTemplate) => {
    const newNote = {
      id: uuidv4(),
      title: template.name === "Blank Note" ? "Untitled Note" : template.name,
      content: template.content,
      preview: template.content.slice(0, 150) || "No content yet...",
      date: new Date().toISOString(),
      tags: [],
      type: template.type,
    };
    addNote(newNote);
    router.push(`/notes/${newNote.id}`);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar animate-fade-in-up">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />

      <div className="relative max-w-3xl w-full space-y-10 z-10 text-center">
        
        {/* Hero Banner card */}
        <GlassCard className="relative flex flex-col items-center justify-center p-8 md:p-10 border-white/10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl shadow-elevated hover-glow group transition-all duration-500 rounded-2xl">
          {/* Animated Glow Border */}
          <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-primary/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 [mask-image:linear-gradient(white,white)_content-box,linear-gradient(white,white)] -z-10" />

          <div className="relative mb-6">
            <div className="relative bg-zinc-950/80 dark:bg-black/40 p-5 rounded-full border border-primary/20 shadow-glow-lg animate-float">
              <StickyNote className="h-10 w-10 text-primary animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-primary/10 blur-md -z-10 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-primary to-pink-500 rounded-full p-1.5 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
          
          <h2 className="mb-3 text-3xl md:text-4xl font-extrabold tracking-tight gradient-text-animated">
            Mind-Sync Workspace Canvas
          </h2>
          
          <p className="max-w-md text-muted-foreground text-sm leading-relaxed mb-4">
            A beautiful, clean canvas connected across all your workspaces. Select an existing note from the sidebar or click a curated template below to manifest your thoughts.
          </p>

          <div className="flex gap-2 justify-center items-center">
             <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse" />
             <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
             <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </GlassCard>

        {/* Quick Start Templates Grid */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 pl-1">
            <Compass className="w-4 h-4 text-primary" />
            Quick Manifest Templates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {NOTE_TEMPLATES.slice(0, 6).map((template) => {
              const Icon = ICON_MAP[template.icon] || File;
              return (
                <div
                  key={template.id}
                  onClick={() => handleCreateFromTemplate(template)}
                  className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/20 dark:bg-white/[0.02] p-5 cursor-pointer hover:border-primary/40 hover:bg-white/40 dark:hover:bg-white/[0.04] transition-all duration-300 hover-lift hover-glow"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-105",
                        template.type === "meeting"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : template.type === "journal"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground/50 group-hover:text-primary/70 transition-colors">
                        {template.type}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                        {template.name}
                      </h4>
                      <p className="text-muted-foreground/80 text-xs leading-normal line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    <span>Create draft</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
