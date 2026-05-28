import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Hash, Calendar, StickyNote, Trash2, BookHeart } from "lucide-react";
import { useNotes, useNoteActions } from "@/store/selectors";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";

interface NotesSidebarProps {
  currentNoteId?: string;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
}

export function NotesSidebar({ currentNoteId, onSelectNote, onCreateNote }: NotesSidebarProps) {
  const notes = useNotes();
  const { deleteNote } = useNoteActions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "meeting" | "personal" | "journal">("all");

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.preview.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || note.type === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="glass-sidebar flex h-full w-full flex-col border-r border-white/5">
      <div className="space-y-4 p-4 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight gradient-text-animated w-fit">
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 shadow-glow animate-float">
              <StickyNote className="h-5 w-5 text-primary" />
            </div>
            Notes
          </h2>
          <Button 
            onClick={onCreateNote} 
            size="icon" 
            variant="default" 
            className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-pink-500 hover:from-primary/95 hover:to-pink-500/95 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-none"
            title="Create Note"
          >
            <Plus className="h-4.5 w-4.5" />
          </Button>
        </div>

        <div className="relative group">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute top-2.5 left-2.5 h-4 w-4 transition-colors duration-300" />
          <Input
            placeholder="Search notes..."
            className="pl-8 bg-white/5 dark:bg-white/[0.02] border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 rounded-xl transition-all duration-300 placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 text-xs px-3 py-1 h-7 rounded-full min-w-[3.5rem] transition-all duration-300",
              filter === "all" 
                ? "bg-gradient-to-r from-primary/15 to-pink-500/15 text-primary border border-primary/20 font-medium" 
                : "bg-white/5 dark:bg-white/[0.02] hover:bg-white/10 dark:hover:bg-white/[0.04] text-muted-foreground border border-transparent"
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("journal")}
            className={cn(
              "flex-1 text-xs px-3 py-1 h-7 rounded-full min-w-[4rem] transition-all duration-300",
              filter === "journal" 
                ? "bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-400 border border-purple-500/20 font-medium" 
                : "bg-white/5 dark:bg-white/[0.02] hover:bg-white/10 dark:hover:bg-white/[0.04] text-muted-foreground border border-transparent"
            )}
          >
            Journal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("meeting")}
            className={cn(
              "flex-1 text-xs px-3 py-1 h-7 rounded-full min-w-[4.5rem] transition-all duration-300",
              filter === "meeting" 
                ? "bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-400 border border-blue-500/20 font-medium" 
                : "bg-white/5 dark:bg-white/[0.02] hover:bg-white/10 dark:hover:bg-white/[0.04] text-muted-foreground border border-transparent"
            )}
          >
            Meetings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("personal")}
            className={cn(
              "flex-1 text-xs px-3 py-1 h-7 rounded-full min-w-[4.5rem] transition-all duration-300",
              filter === "personal" 
                ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-400 border border-emerald-500/20 font-medium" 
                : "bg-white/5 dark:bg-white/[0.02] hover:bg-white/10 dark:hover:bg-white/[0.04] text-muted-foreground border border-transparent"
            )}
          >
            Personal
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2.5 pb-6 pt-1">
          {filteredNotes.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center text-sm bg-white/5 dark:bg-white/[0.01] rounded-xl border border-dashed border-white/10 mx-1">
              No notes found
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "group relative cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] hover-glow",
                  currentNoteId === note.id
                    ? "bg-gradient-to-br from-primary/10 via-pink-500/5 to-transparent border-primary/45 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "bg-white/30 dark:bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/60 dark:hover:bg-white/[0.04]"
                )}
              >
                <div className="mb-1.5 flex items-start justify-between">
                  <h3
                    className={cn(
                      "line-clamp-1 text-sm font-semibold transition-colors duration-300 group-hover:text-primary",
                      currentNoteId === note.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {note.title || "Untitled"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] whitespace-nowrap text-muted-foreground/80 font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      {format(new Date(note.date), "MMM d")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-lg transition-all duration-300 hover:bg-destructive/15 hover:text-destructive text-muted-foreground hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Optimistic delete via store
                        deleteNote(note.id);
                      }}
                      title="Delete Note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground/85 mb-3 line-clamp-2 text-xs leading-relaxed">
                  {note.preview || "No content yet..."}
                </p>

                {/* Mini Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {note.type === "journal" && (
                    <div className="flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-medium text-purple-400">
                      <BookHeart className="h-2.5 w-2.5" />
                      <span>Journal</span>
                    </div>
                  )}
                  {note.type === "meeting" && (
                    <div className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-medium text-blue-400">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>Meeting</span>
                    </div>
                  )}
                  {note.tags?.slice(0, 2).map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-0.5 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-medium text-muted-foreground/80"
                    >
                      <Hash className="h-2.5 w-2.5 text-muted-foreground/50" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
