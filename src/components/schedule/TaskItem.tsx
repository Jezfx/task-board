'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Pencil, ArrowRight } from 'lucide-react';
import { Task, useTaskBoardStore } from '@/store/taskboard';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const { toggleTask, updateTask, deleteTask, moveTaskToNextDay } =
    useTaskBoardStore();

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        setIsTruncated(
          titleRef.current.scrollWidth > titleRef.current.clientWidth
        );
      }
    };
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [task.title]);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        onBlur={handleSaveEdit}
        onKeyDown={handleKeyDown}
        className="h-7 text-sm"
      />
    );
  }

  const titleContent = (
    <span
      ref={titleRef}
      className={cn(
        'text-sm truncate flex-1',
        task.completed && 'line-through text-muted-foreground'
      )}
    >
      {task.title}
    </span>
  );

  return (
    <div className="group flex items-center gap-1.5 p-1.5 rounded border bg-background hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="h-4 w-4 flex-shrink-0"
      />

      {isTruncated ? (
        <Tooltip>
          <TooltipTrigger asChild>{titleContent}</TooltipTrigger>
          <TooltipContent>
            <p>{task.title}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        titleContent
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-muted flex-shrink-0">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          {!task.completed && (
            <DropdownMenuItem onClick={() => moveTaskToNextDay(task.id)}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Move to next day
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => deleteTask(task.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
