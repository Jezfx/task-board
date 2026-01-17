'use client';

import { useState } from 'react';
import { Task, useTaskBoardStore } from '@/store/taskboard';
import { TaskItem } from './TaskItem';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TaskCellProps {
  projectId: string;
  date: string;
  tasks: Task[];
  isToday: boolean;
}

export function TaskCell({ projectId, date, tasks, isToday }: TaskCellProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { addTask } = useTaskBoardStore();

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(projectId, date, newTaskTitle.trim());
      setNewTaskTitle('');
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const handleCellClick = () => {
    if (!isAdding) {
      setIsAdding(true);
    }
  };

  return (
    <div
      onClick={handleCellClick}
      className={cn(
        'p-2 border-b flex flex-col gap-1 cursor-pointer hover:bg-muted/30 transition-colors',
        isToday && 'bg-primary/5 hover:bg-primary/10'
      )}
    >
      {/* Tasks */}
      {tasks.map((task) => (
        <div key={task.id} onClick={(e) => e.stopPropagation()}>
          <TaskItem task={task} />
        </div>
      ))}

      {/* Add task input */}
      {isAdding && (
        <Input
          autoFocus
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onBlur={handleAddTask}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          placeholder="Task title..."
          className="h-7 text-sm"
        />
      )}
    </div>
  );
}
