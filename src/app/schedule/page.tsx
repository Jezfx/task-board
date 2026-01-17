'use client';

import { WeekHeader } from '@/components/schedule/WeekHeader';
import { BoardGrid } from '@/components/schedule/BoardGrid';

export default function SchedulePage() {
  return (
    <div className="p-4">
      <WeekHeader />
      <BoardGrid />
    </div>
  );
}
