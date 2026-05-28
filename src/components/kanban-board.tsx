"use client";

/**
 * Kanban Board Component
 * Drag-and-drop task management with status columns
 */

import { useState, useMemo, useCallback, memo, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Column, ViewSettings } from "@/store/useStore";
import { useTasks, useTaskActions, useColumns, useViewSettings } from "@/store/selectors";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/features/tasks/components/PriorityBadge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GripVertical,
  Calendar,
  Clock,
  Plus,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { BulkActionBar } from "@/components/kanban/bulk-action-bar";
import { TaskPreviewDialog } from "@/components/kanban/task-preview-dialog";
import { SwimlaneBoard } from "@/components/kanban/swimlane-board";
import { useMediaQuery } from "@/hooks/use-media-query";

// Sortable Task Card Component
const SortableTaskCard = memo(function SortableTaskCard({
  task,
  onToggle,
  isSelected,
  onSelect,
  selectionMode,
  viewSettings,
  taskMap,
  onCardClick,
}: {
  task: Task;
  onToggle: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectionMode: boolean;
  viewSettings: ViewSettings;
  taskMap: Map<string, Task>;
  onCardClick?: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const isCompact = viewSettings.density === "compact";

  // Check if task is blocked by another task
  const blockingTask = task.dependsOn ? taskMap.get(task.dependsOn) : null;
  const isBlocked = blockingTask && !blockingTask.completed;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);

    if (isPast(date) && !task.completed) {
      return (
        <span className="flex items-center gap-1 text-xs text-rose-500 font-semibold dark:text-rose-400">
          <Calendar className="h-3 w-3" />
          {!isCompact && "Overdue"}
        </span>
      );
    }
    if (isToday(date)) {
      return (
        <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold dark:text-amber-400">
          <Calendar className="h-3 w-3" />
          {!isCompact && "Today"}
        </span>
      );
    }
    if (isTomorrow(date)) {
      return (
        <span className="flex items-center gap-1 text-xs text-indigo-500 font-semibold dark:text-indigo-400">
          <Calendar className="h-3 w-3" />
          {!isCompact && "Tomorrow"}
        </span>
      );
    }
    return (
      <span className="text-muted-foreground flex items-center gap-1 text-xs">
        <Calendar className="h-3 w-3" />
        {format(date, "MMM d")}
      </span>
    );
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl cursor-grab active:cursor-grabbing",
        "group hover:border-indigo-500/40 dark:hover:border-indigo-500/40 relative transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] hover:-translate-y-0.5",
        isDragging && "ring-2 ring-indigo-500 opacity-40 shadow-2xl scale-[1.02]",
        isSelected && "border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/30",
        isBlocked && "opacity-60 border-orange-300/60 dark:border-orange-700/60 bg-orange-500/[0.02]",
        isCompact ? "p-2.5" : "p-4"
      )}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey || selectionMode) {
          e.preventDefault();
          e.stopPropagation();
          onSelect(task.id);
        } else if (onCardClick) {
          e.preventDefault();
          e.stopPropagation();
          onCardClick(task);
        }
      }}
    >
      {/* Blocked Indicator */}
      {isBlocked && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-orange-500 p-1 shadow-md shadow-orange-500/20" title={`Blocked by: ${blockingTask?.title}`}>
          <Lock className="h-3 w-3 text-white" />
        </div>
      )}
      {/* Cover Image */}
      {viewSettings.showCoverImages && task.coverImage && !isCompact && (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
          <Image
            src={task.coverImage}
            alt={task.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {!isCompact && (
          <GripVertical className="text-muted-foreground/30 mt-1 h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Checkbox
                checked={selectionMode ? isSelected : task.completed}
                onCheckedChange={() => {
                  if (selectionMode) onSelect(task.id);
                  else onToggle(task.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "mt-0.5 shadow-sm border-slate-300 dark:border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600",
                  selectionMode ? "border-blue-500 data-[state=checked]:bg-blue-500" : ""
                )}
              />
              <span
                className={cn(
                  "truncate text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200",
                  task.completed && !selectionMode && "text-muted-foreground/60 line-through"
                )}
              >
                {task.title}
              </span>
            </div>
            {task.priority && (
              <div 
                className="flex-shrink-0"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <PriorityBadge priority={task.priority} size="sm" />
              </div>
            )}
          </div>

          {!isCompact && (
            <>
              <div className="mt-2.5 ml-6 flex items-center gap-3">
                {getDueDateDisplay()}
                {task.estimatedMinutes && (
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {task.estimatedMinutes}m
                  </span>
                )}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-1.5">
                    {task.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0 text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-none font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtask Progress */}
              {totalSubtasks > 0 && (
                <div className="mt-2.5 ml-6 space-y-1.5">
                  <div className="text-muted-foreground flex items-center justify-between text-[11px] font-medium">
                    <span>
                      {completedSubtasks}/{totalSubtasks} subtasks
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                </div>
              )}

              {/* Footer with Assignees */}
              {task.assignees && task.assignees.length > 0 && (
                <div className="mt-3.5 ml-6 flex -space-x-2 overflow-hidden">
                  {task.assignees.map((assignee, i) => (
                    <Avatar key={i} className="ring-background inline-block h-6 w-6 ring-2 dark:ring-slate-900 border border-black/5 dark:border-white/10 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {assignee.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prev, next) => (
  prev.task === next.task &&
  prev.isSelected === next.isSelected &&
  prev.selectionMode === next.selectionMode &&
  prev.viewSettings === next.viewSettings &&
  prev.taskMap === next.taskMap &&
  prev.onCardClick === next.onCardClick
));

// Task Card for Drag Overlay
function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="ring-primary border-primary/50 bg-card animate-pulse-glow cursor-grabbing rounded-lg border p-3 shadow-2xl ring-2">
      <div className="flex items-center gap-2">
        <GripVertical className="text-muted-foreground/50 h-4 w-4" />
        <span className="text-sm font-medium">{task.title}</span>
        {task.priority && <PriorityBadge priority={task.priority} size="sm" />}
      </div>
    </div>
  );
}

// Kanban Column Component
const KanbanColumn = memo(function KanbanColumn({
  column,
  tasks,
  onToggleTask,
  onAddTask,
  selectedIds,
  onSelectTask,
  viewSettings,
  taskMap,
  onCardClick,
}: {
  column: Column;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (columnId: string) => void;
  selectedIds: string[];
  onSelectTask: (id: string) => void;
  viewSettings: ViewSettings;
  taskMap: Map<string, Task>;
  onCardClick?: (task: Task) => void;
}) {
  const isOverLimit =
    column.wipLimit && tasks.length > column.wipLimit && column.id === "InProgress";

  // Make column a droppable zone for empty states
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  // Premium custom styling mapping
  const getColumnGlassStyle = (columnId: string) => {
    switch (columnId) {
      case "Todo":
        return cn(
          "bg-slate-500/5 dark:bg-slate-400/5 backdrop-blur-xl",
          "border border-slate-500/10 dark:border-slate-400/10",
          "shadow-[0_8px_32px_rgba(100,116,139,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)]",
          "hover:border-slate-500/20 dark:hover:border-slate-400/20 transition-all duration-300"
        );
      case "InProgress":
        return cn(
          "bg-indigo-500/5 dark:bg-indigo-400/5 backdrop-blur-xl",
          "border border-indigo-500/10 dark:border-indigo-400/10",
          "shadow-[0_8px_32px_rgba(99,102,241,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
          "hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300"
        );
      case "Done":
        return cn(
          "bg-emerald-500/5 dark:bg-emerald-400/5 backdrop-blur-xl",
          "border border-emerald-500/10 dark:border-emerald-400/10",
          "shadow-[0_8px_32px_rgba(16,185,129,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
          "hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all duration-300"
        );
      case "Backlog":
        return cn(
          "bg-amber-500/5 dark:bg-amber-400/5 backdrop-blur-xl",
          "border border-amber-500/10 dark:border-amber-400/10",
          "shadow-[0_8px_32px_rgba(245,158,11,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)]",
          "hover:border-amber-500/20 dark:hover:border-amber-400/20 transition-all duration-300"
        );
      default:
        return "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md";
    }
  };

  const getHeaderBadgeStyle = (columnId: string) => {
    switch (columnId) {
      case "Todo":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20";
      case "InProgress":
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20";
      case "Done":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20";
      case "Backlog":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20";
      default:
        return "bg-secondary text-secondary-foreground border border-border";
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl p-4 transition-all duration-300",
        "max-h-[50vh] md:max-h-[calc(100vh-12rem)]",
        "w-full md:max-w-[360px] md:min-w-[280px] md:flex-1",
        getColumnGlassStyle(column.id),
        isOverLimit && "bg-destructive/10 ring-destructive/20 ring-2",
        isOver && "ring-primary ring-2 ring-inset"
      )}
    >
      <div className="mb-4 flex flex-shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={cn("font-bold tracking-wide", column.color)}>{column.title}</h3>
          <Badge className={cn("text-xs font-semibold px-2 py-0.5", getHeaderBadgeStyle(column.id))}>
            {tasks.length}
            {column.wipLimit ? `/${column.wipLimit}` : ""}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          onClick={() => onAddTask(column.id)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 min-h-[100px] flex-1 space-y-2.5 overflow-y-auto pr-1">
          <AnimatePresence>
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                isSelected={selectedIds.includes(task.id)}
                onSelect={onSelectTask}
                selectionMode={selectedIds.length > 0}
                viewSettings={viewSettings}
                taskMap={taskMap}
                onCardClick={onCardClick}
              />
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="text-muted-foreground rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 py-10 text-center text-sm backdrop-blur-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
});

// Main Kanban Board Component
export function KanbanBoard() {
  const tasks = useTasks();
  const columns = useColumns();
  const viewSettings = useViewSettings();
  const { toggleTask, updateTask } = useTaskActions();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const taskMap = useMemo(() => new Map<string, Task>(tasks.map((t) => [t.id, t])), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status (or columnId if present)
  // Memoized to prevent recalculation on every render
  const tasksByColumn = useMemo(() => {
    const map = new Map<string, Task[]>();

    // Helper function
    const getTasksForColumn = (columnId: string) => {
      return tasks.filter((task) => {
        // Explicit assignment
        if (task.columnId === columnId) return true;

        // Fallback for legacy/unmigrated data
        if (!task.columnId) {
          if (columnId === "Done") return task.completed;
          if (columnId === "InProgress") return !task.completed && task.tags?.includes("in-progress");
          if (columnId === "Todo") return !task.completed && !task.tags?.includes("in-progress");
        }
        return false;
      });
    };

    for (const column of columns) {
      map.set(column.id, getTasksForColumn(column.id));
    }
    return map;
  }, [tasks, columns]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Safety check for tasks array
    if (!Array.isArray(tasks)) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // In dnd-kit sortable, dropping A over B implies A should be in B's list.
    const overTask = tasks.find((t) => t.id === over.id);
    let targetColumnId = overTask?.columnId;

    // Fallback if overTask doesn't have columnId
    if (!targetColumnId && overTask) {
      if (overTask.completed) targetColumnId = "Done";
      else if (overTask.tags?.includes("in-progress")) targetColumnId = "InProgress";
      else targetColumnId = "Todo";
    }

    // Check if we dropped directly onto a column (e.g., empty state)
    if (!targetColumnId && columns.some((c) => c.id === over.id)) {
      targetColumnId = over.id as string;
    }

    if (targetColumnId && targetColumnId !== activeTask.columnId) {
      updateTask(activeTask.id, { columnId: targetColumnId });

      // Handle completion status change based on column
      if (targetColumnId === "Done" && !activeTask.completed) {
        toggleTask(activeTask.id);
      } else if (targetColumnId !== "Done" && activeTask.completed) {
        toggleTask(activeTask.id);
      }
    }
  }, [tasks, columns, updateTask, toggleTask]);

  const handleAddTask = useCallback(() => {
    // Open create task dialog (to be implemented/wired)
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // Mobile navigation handlers
  const navigateColumn = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next"
        ? Math.min(activeColumnIndex + 1, columns.length - 1)
        : Math.max(activeColumnIndex - 1, 0);
    
    if (scrollRef.current) {
      const colWidth = scrollRef.current.offsetWidth * 0.85; // Matches w-[85vw]
      scrollRef.current.scrollTo({
        left: newIndex * (colWidth + 16), // 16 is the gap-4
        behavior: "smooth",
      });
      setActiveColumnIndex(newIndex);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const colWidth = e.currentTarget.offsetWidth * 0.85;
    const newIndex = Math.round(scrollLeft / (colWidth + 16));
    if (newIndex !== activeColumnIndex) {
      setActiveColumnIndex(newIndex);
    }
  };

  if (viewSettings.mode === "swimlane") {
    return <SwimlaneBoard />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mobile Column Navigation UI */}
      {isMobile && (
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className={cn("text-lg font-bold transition-colors", columns[activeColumnIndex]?.color)}>
              {columns[activeColumnIndex]?.title}
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {(tasksByColumn.get(columns[activeColumnIndex]?.id) || []).length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateColumn("prev")}
              disabled={activeColumnIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1.5 px-2">
              {columns.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeColumnIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateColumn("next")}
              disabled={activeColumnIndex === columns.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "flex gap-4 h-full pb-4 scrollbar-none md:scrollbar-thin",
            isMobile 
              ? "flex-row overflow-x-auto snap-x snap-mandatory px-4 -mx-4 scroll-smooth" 
              : "flex-row overflow-x-auto"
          )}
        >
          {columns.map((column) => (
            <div 
              key={column.id} 
              className={cn(
                "flex-shrink-0 transition-all",
                isMobile ? "w-[85vw] snap-center" : "w-[320px] md:min-w-[300px] md:flex-1"
              )}
            >
              <KanbanColumn
                column={column}
                tasks={tasksByColumn.get(column.id) || []}
                onToggleTask={toggleTask}
                onAddTask={handleAddTask}
                selectedIds={selectedIds}
                onSelectTask={toggleSelection}
                viewSettings={viewSettings}
                taskMap={taskMap}
                onCardClick={setPreviewTask}
              />
            </div>
          ))}
        </div>

        <DragOverlay>{activeTask && <TaskCardOverlay task={activeTask} />}</DragOverlay>

        <BulkActionBar selectedIds={selectedIds} onClearSelection={() => setSelectedIds([])} />
      </DndContext>

      <TaskPreviewDialog
        task={previewTask}
        open={!!previewTask}
        onOpenChange={(open) => !open && setPreviewTask(null)}
      />
    </div>
  );
}

export default KanbanBoard;
