import { useTaskStore } from "../store/useTaskStore";
import TimelineHeader from "../components/TimelineHeader";
import TimelineRow from "../components/TimelineRow";

export default function TimelineView() {
  const tasks = useTaskStore((state) => state.tasks);

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const daysInMonth = monthEnd.getDate();
  const dayWidth = 30;
  const totalWidth = daysInMonth * dayWidth;

  return (
    <div className="border h-[500px] flex bg-gray-50">

  <div className="flex-1 overflow-auto bg-gray-50">
    <div className="w-fit">

      {/* HEADER ROW */}
      <div className="flex sticky top-0 z-10">
        <div className="w-60 border-r border-b bg-white h-10 flex items-center px-2 font-semibold">
          Tasks
        </div>

        <TimelineHeader
          daysInMonth={daysInMonth}
          dayWidth={dayWidth}
        />
      </div>

      {/* TASK ROWS */}
      {tasks.map((task) => (
        <div key={task.id} className="flex hover:bg-blue-50">

          {/* LEFT */}
          <div className="w-60 border-r bg-white h-12 flex flex-col justify-center px-2 border-b">
            <div className="text-sm font-medium truncate">
              {task.title}
            </div>
            <div className="text-xs text-gray-500">
              {task.assignee}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative h-12 border-b" style={{ width: totalWidth }}>
            <TimelineRow
              task={task}
              monthStart={monthStart}
              monthEnd={monthEnd}
              dayWidth={dayWidth}
            />
          </div>

        </div>
      ))}
    </div>
  </div>
</div>
  );
}