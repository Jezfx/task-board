'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskBoardStore } from '@/store/taskboard';
import { getWeekRange, getPreviousWeek, getNextWeek } from '@/lib/dates';

export function WeekHeader() {
  const { weekStartISO, setWeekStartISO } = useTaskBoardStore();
  const weekRange = getWeekRange(weekStartISO);

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setWeekStartISO(getPreviousWeek(weekStartISO))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[180px]">{weekRange}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setWeekStartISO(getNextWeek(weekStartISO))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
