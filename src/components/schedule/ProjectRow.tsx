'use client';

import { Project, useTaskBoardStore } from '@/store/taskboard';
import { TaskCell } from './TaskCell';
import { cn } from '@/lib/utils';

interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
}

interface ProjectRowProps {
  project: Project;
  weekDays: WeekDay[];
  searchQuery: string;
  rowCount: number;
}

export function ProjectRow({ project, weekDays, searchQuery, rowCount }: ProjectRowProps) {
  const { tasks } = useTaskBoardStore();

  return (
    <div className="grid grid-cols-8 flex-1">
      {/* Project info cell */}
      <div className="p-3 border-r border-b bg-muted/10 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <span className="font-medium text-sm truncate" title={project.name}>
            {project.name}
          </span>
        </div>
        <span className="text-xs text-muted-foreground uppercase mt-0.5 ml-4.5">
          {project.status === 'active' ? 'Active' : 'Archived'}
        </span>
      </div>

      {/* Task cells for each day */}
      {weekDays.map((day) => {
        const dayTasks = tasks.filter(
          (t) =>
            t.projectId === project.id &&
            t.date === day.date &&
            (searchQuery === '' ||
              t.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        return (
          <TaskCell
            key={day.date}
            projectId={project.id}
            date={day.date}
            tasks={dayTasks}
            isToday={day.isToday}
          />
        );
      })}
    </div>
  );
}
