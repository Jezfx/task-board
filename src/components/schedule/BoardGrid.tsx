'use client';

import { useTaskBoardStore } from '@/store/taskboard';
import { getWeekDays } from '@/lib/dates';
import { ProjectRow } from './ProjectRow';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function BoardGrid() {
  const { projects, weekStartISO, query } = useTaskBoardStore();
  const weekDays = getWeekDays(weekStartISO);
  const activeProjects = projects.filter((p) => p.status === 'active');

  return (
    <ScrollArea className="w-full h-[calc(100vh-12rem)]">
      <div className="border rounded-lg overflow-hidden min-w-[800px] h-full flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-muted/30">
          {/* Projects header cell */}
          <div className="p-3 border-r border-b font-medium text-xs text-muted-foreground uppercase tracking-wide">
            Projects
          </div>
          {/* Day columns */}
          {weekDays.map((day) => (
            <div
              key={day.date}
              className={cn(
                'p-3 border-b text-center',
                day.isToday && 'bg-primary/5'
              )}
            >
              <div className="text-xs text-muted-foreground uppercase">
                {day.dayName}
              </div>
              <div className={cn('text-lg font-semibold', day.isToday && 'text-primary')}>
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>

        {/* Project Rows */}
        {activeProjects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">
            No projects yet. Create one in the Projects tab.
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {activeProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                weekDays={weekDays}
                searchQuery={query}
                rowCount={activeProjects.length}
              />
            ))}
          </div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
