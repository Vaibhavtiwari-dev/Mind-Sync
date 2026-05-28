"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Note } from "@/store/useStore";
import { useNoteActions, useTaskActions } from "@/store/selectors";
import { toast } from "sonner";
import { format } from "date-fns";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { analyzeSentiment } from "@/features/ai/advanced-ai";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Sparkles, 
  Calendar,
  Clock
} from "lucide-react";

export function Editor({ note, initialContent }: { note?: Note; initialContent?: string }) {
  const { updateNote } = useNoteActions();
  const { addTask } = useTaskActions();

  const [title, setTitle] = useState(note?.title || "Untitled");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(
    note?.sentiment || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Set up Yjs document and PartyKit provider
  const { ydoc, provider } = useMemo(() => {
    if (!note?.id) return { ydoc: null, provider: null };
    
    const ydoc = new Y.Doc();
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";
    const provider = new YPartyKitProvider(host, `note-${note.id}`, ydoc);
    
    return { ydoc, provider };
  }, [note?.id]);

  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  // Debounce title updates
  useEffect(() => {
    if (note && title !== note.title) {
      const timer = setTimeout(() => {
        updateNote(note.id, { title, date: new Date().toISOString() });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [title, note, updateNote]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // @ts-expect-error - history exists in StarterKit but types may be missing
        history: false, // History is handled by Yjs
      }),
      Placeholder.configure({
        placeholder: 'Start writing, or press "/" for commands...',
      }),
      ...(ydoc ? [Collaboration.configure({ document: ydoc })] : []),
    ],

    immediatelyRender: false,
    content: ydoc ? undefined : note?.content || initialContent || "",

    editorProps: {
      attributes: {
        class:
          "prose prose-custom dark:prose-invert max-w-none focus:outline-none min-h-[500px] py-4 leading-relaxed font-sans text-foreground/90 selection:bg-primary/20 tiptap",
      },
    },

    onUpdate: ({ editor }) => {
      const { selection } = editor.state;
      const { $from } = selection;
      const currentLineText = $from.parent.textContent;

      const actionItemMatch = currentLineText.match(/^(TODO:|Action Item:)\s+(.+)$/i);

      if (actionItemMatch) {
        const taskTitle = actionItemMatch[2].trim();
        if (taskTitle.length > 3) {
          toast(`Action Item detected: "${taskTitle}"`, {
            id: `action-item-${taskTitle.slice(0, 10)}`,
            action: {
              label: "Create Task",
              onClick: () => {
                addTask(taskTitle);
                toast.success("Task created!");
              },
            },
            duration: 5000,
          });
        }
      }

      if (note) {
        const content = editor.getHTML();
        const text = editor.getText();
        const preview = text.slice(0, 150) + (text.length > 150 ? "..." : "");

        updateNote(note.id, {
          content,
          preview,
          date: new Date().toISOString(),
        });
      }
    },
  });

  // Perform AI sentiment analysis on-demand
  const triggerSentimentAnalysis = useCallback(async () => {
    if (!note) return;
    setIsAnalyzing(true);
    const contentText = editor?.getText() || "";
    
    if (contentText.trim().length < 50) {
      toast.warning("Write at least 50 characters to analyze sentiment!");
      setIsAnalyzing(false);
      return;
    }

    try {
      const result = await analyzeSentiment(contentText, note.id);
      if (result.success) {
        const overallSentiment = result.data.overall;
        setSentiment(overallSentiment);
        updateNote(note.id, {
          sentiment: overallSentiment,
        });
        toast.success(`Sentiment Analysis Complete: ${overallSentiment.toUpperCase()}`);
      } else {
        toast.error("Analysis rate limit hit. Please try again in a minute!");
      }
    } catch (error) {
      console.error("Sentiment analysis failed", error);
      toast.error("Failed to run sentiment analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [note, updateNote, editor]);

  if (!editor) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-8 py-8 animate-fade-in-up space-y-6">
      
      {/* AI Dashboard Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-1 group/title relative">
          <input
              type="text"
              placeholder="Untitled note"
              className="placeholder:text-muted-foreground/20 w-full border-none bg-transparent text-3xl sm:text-4xl font-extrabold tracking-tight focus:outline-none flex-1 py-1 transition-all duration-300 text-foreground"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={!note}
          />
          <div className="absolute bottom-0 left-0 h-0.5 w-0 group-focus-within/title:w-full bg-gradient-to-r from-primary via-pink-500 to-blue-500 transition-all duration-500" />
        </div>

        {/* Note Metadata Banner */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-muted-foreground/80 bg-white/5 dark:bg-white/[0.02] border border-white/5 px-3.5 py-1.5 rounded-full shadow-glow">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            {note ? format(new Date(note.date), "MMMM d, yyyy") : format(new Date(), "MMMM d, yyyy")}
          </span>
          
          <span className="flex items-center gap-1.5 capitalize text-muted-foreground/80 bg-white/5 dark:bg-white/[0.02] border border-white/5 px-3.5 py-1.5 rounded-full shadow-glow">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              note?.type === "journal" ? "bg-purple-400 animate-pulse" :
              note?.type === "meeting" ? "bg-blue-400 animate-pulse" :
              "bg-emerald-400 animate-pulse"
            )} />
            {note?.type || "Draft"} Note
          </span>

          <span className="flex items-center gap-1.5 text-muted-foreground/80 bg-white/5 dark:bg-white/[0.02] border border-white/5 px-3.5 py-1.5 rounded-full shadow-glow">
            <Clock className="h-3.5 w-3.5 text-secondary/70 animate-pulse" />
            Active Sync
          </span>
        </div>
      </div>

      {/* Advanced interactive AI Sentiment Panel */}
      {note && (
        <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-primary/5 via-pink-500/[0.01] to-transparent p-5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 hover:border-primary/20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '5s' }} />
              Aether AI Workspace Assistant
            </div>
            <p className="text-xs text-muted-foreground leading-normal max-w-xl">
              Understand the emotional frequency and vibration of your journals. Our local intelligence categorizes tone, extracts key events, and checks cognitive alignment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {sentiment ? (
              <Badge variant="outline" className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-glow border-white/10",
                sentiment === "positive" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                sentiment === "negative" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" :
                "border-blue-500/30 text-blue-400 bg-blue-500/10"
              )}>
                {sentiment === "positive" ? "🌟 Positive Vibration" :
                 sentiment === "negative" ? "🌧️ Stormy Sentiment" :
                 "😐 Balanced Focus"}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground/80 font-medium">No sentiment analyzed</span>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={triggerSentimentAnalysis}
              disabled={isAnalyzing}
              className="rounded-xl border-primary/20 hover:border-primary/50 text-foreground hover:bg-primary/10 transition-all duration-300 font-medium gap-2 text-xs"
            >
              <Sparkles className={cn("w-3.5 h-3.5", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Toolbars */}
      {note && (
        <div className="glass sticky top-4 z-10 flex items-center justify-between gap-2 p-2 rounded-xl shadow-glow-lg border border-white/10 dark:border-white/5 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center gap-1">
            <Toggle 
              size="sm" 
              pressed={editor.isActive("bold")} 
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle 
              size="sm" 
              pressed={editor.isActive("italic")} 
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            
            <Separator orientation="vertical" className="mx-1.5 h-5 bg-white/10" />
            
            <Toggle 
              size="sm" 
              pressed={editor.isActive("heading", { level: 1 })} 
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle 
              size="sm" 
              pressed={editor.isActive("heading", { level: 2 })} 
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            
            <Separator orientation="vertical" className="mx-1.5 h-5 bg-white/10" />
            
            <Toggle 
              size="sm" 
              pressed={editor.isActive("bulletList")} 
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle 
              size="sm" 
              pressed={editor.isActive("orderedList")} 
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle 
              size="sm" 
              pressed={editor.isActive("blockquote")} 
              onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
              className="rounded-lg hover:bg-white/10 dark:hover:bg-white/5 data-[state=on]:bg-primary/15 data-[state=on]:text-primary transition-all duration-200"
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </Toggle>
          </div>

          <div className="flex items-center gap-1.5 pr-1.5">
            <span className="text-[10px] text-muted-foreground/75 font-semibold bg-white/5 dark:bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-md">
              {editor.storage.characterCount ? `${editor.storage.characterCount.words()} words` : ""}
            </span>
          </div>
        </div>
      )}

      {/* Editor Content Canvas */}
      <div className="min-h-[500px] border-t border-white/5 pt-6 focus-within:border-primary/20 transition-all duration-300">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
