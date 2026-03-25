import TimelineBar from "./TimelineBar";
import type { Task } from "../types/task";

export default function TimelineRow({
  task,
  monthStart,
  monthEnd,
  dayWidth,
}: {
  task: Task;
  monthStart: Date;
  monthEnd: Date;
  dayWidth: number;
}) {
  const dueDate = new Date(task.dueDate);
  const startDate = task.startDate
    ? new Date(task.startDate)
    : null;

  return (
    <div className="h-12 border-b relative flex items-center">
      <TimelineBar
        startDate={startDate}
        dueDate={dueDate}
        monthStart={monthStart}
        monthEnd={monthEnd}
        dayWidth={dayWidth}
        priority={task.priority}
      />
    </div>
  );
}