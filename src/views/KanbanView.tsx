import { useState, useMemo, useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useCollabStore } from "../store/useCollabStore";
import { useFilterStore } from "../store/useFilterStore";
import type { Task, Status } from "../types/task";

const COLUMNS: { key: Status; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "done", label: "Done" },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const AVATAR_BG: Record<string, string> = {
  A: "bg-blue-200 text-blue-800",
  B: "bg-purple-200 text-purple-800",
  C: "bg-pink-200 text-pink-800",
  D: "bg-teal-200 text-teal-800",
  E: "bg-orange-200 text-orange-800",
  F: "bg-indigo-200 text-indigo-800",
};

export default function KanbanView() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const collabUsers = useCollabStore((s) => s.users);
  const filters = useFilterStore((s) => s.filters);

  const [dragging, setDragging] = useState<Task | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [overCol, setOverCol] = useState<Status | null>(null);
  const [phIdx, setPhIdx] = useState<number | null>(null);

  const filtered = useMemo(() => tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assignee)) return false;
    if (filters.dateFrom && new Date(t.dueDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(t.dueDate) > new Date(filters.dateTo)) return false;
    return true;
  }), [tasks, filters]);

  const grouped = useMemo(() => {
    const m: Record<Status, Task[]> = { todo: [], inprogress: [], review: [], done: [] };
    filtered.forEach((t) => m[t.status].push(t));
    return m;
  }, [filtered]);

  useEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
    return () => { document.body.style.userSelect = ""; };
  }, [dragging]);

  function startDrag(e: React.MouseEvent | React.TouchEvent, task: Task) {
    if ("button" in e && e.button !== 0) return;
    e.preventDefault();
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    setDragging(task);
    setPos({ x: clientX, y: clientY });
  }

  function onMove(x: number, y: number) {
    setPos({ x, y });
    const el = document.elementFromPoint(x, y)?.closest("[data-col]") as HTMLElement | null;
    if (!el) { setOverCol(null); setPhIdx(null); return; }
    const col = el.getAttribute("data-col") as Status;
    setOverCol(col);
    const cards = el.querySelectorAll("[data-card]");
    let idx = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) { idx = i; break; }
    }
    setPhIdx(idx);
  }

  function endDrag() {
    if (dragging && overCol) updateTask(dragging.id, { status: overCol });
    setDragging(null);
    setOverCol(null);
    setPhIdx(null);
  }

  useEffect(() => {
    if (!dragging) return;
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", endDrag);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", endDrag);
    };
  }, [dragging, overCol]);

  const today = new Date();

  return (
    <>
      <div className="grid grid-cols-4 gap-3 h-[520px]">
        {COLUMNS.map((col) => {
          const colTasks = grouped[col.key];
          return (
            <div
              key={col.key}
              data-col={col.key}
              className={`flex flex-col border bg-gray-50 ${
                overCol === col.key ? "bg-gray-200" : ""
              }`}
            >
              {/* Column header */}
              <div className="flex justify-between items-center px-3 py-2 border-b bg-white">
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs text-gray-500">{colTasks.length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {colTasks.length === 0 && (
                  <div className="h-full flex items-center justify-center border border-dashed text-sm py-8">
                    No tasks
                  </div>
                )}

                {colTasks.map((task, i) => {
                  const due = new Date(task.dueDate);
                  const isToday = due.toDateString() === today.toDateString();
                  const isOverdue = due < today && !isToday;
                  const diffDays = Math.floor((today.getTime() - due.getTime()) / 86400000);
                  const onTask = collabUsers.filter((u) => u.taskId === task.id);
                  const show = onTask.slice(0, 2);
                  const extra = onTask.length - show.length;

                  return (
                    <div key={task.id}>
                      {overCol === col.key && phIdx === i && (
                        <div className="h-20 border border-dashed mb-2" />
                      )}
                      <div
                        data-card
                        onMouseDown={(e) => startDrag(e, task)}
                        onTouchStart={(e) => startDrag(e, task)}
                        className={`bg-white border p-2 text-sm cursor-grab select-none ${
                          dragging?.id === task.id ? "opacity-30" : ""
                        }`}
                      >
                        {/* Title row */}
                        <div className="flex justify-between gap-2 mb-1.5">
                          <span className="font-medium text-gray-800 text-sm leading-snug">{task.title}</span>
                          <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs font-bold ${AVATAR_BG[task.assignee] ?? "bg-gray-200 text-gray-700"}`}>
                            {task.assignee}
                          </div>
                        </div>

                        {/* Priority badge */}
                        <span className={`inline-block text-xs px-1 py-0.5 border capitalize ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>

                        {/* Due date + collab avatars */}
                        <div className="flex justify-between items-center mt-1.5">
                          <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
                            {isToday ? "Due Today" : isOverdue && diffDays > 7 ? `${diffDays}d overdue` : due.toLocaleDateString()}
                          </span>
                          {onTask.length > 0 && (
                            <div className="flex" style={{ gap: 0 }}>
                              {show.map((u, j) => (
                                <div
                                  key={u.id}
                                  title={u.name}
                                  style={{ backgroundColor: u.color, marginLeft: j === 0 ? 0 : -5, zIndex: show.length - j }}
                                  className="w-4 h-4 rounded-full border border-white text-white text-[8px] font-bold flex items-center justify-center"
                                >
                                  {u.name[0]}
                                </div>
                              ))}
                              {extra > 0 && (
                                <div style={{ marginLeft: -5 }} className="w-4 h-4 rounded-full border border-white bg-gray-300 text-[8px] font-bold text-gray-600 flex items-center justify-center">
                                  +{extra}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {overCol === col.key && phIdx === colTasks.length && (
                  <div className="h-20 border border-dashed" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag ghost */}
      {dragging && (
        <div
          style={{ position: "fixed", top: pos.y + 8, left: pos.x + 8, zIndex: 999, pointerEvents: "none" }}
          className="bg-white border p-2 text-sm w-40 opacity-80 shadow"
        >
          <div className="truncate">{dragging.title}</div>
          <span className={`text-xs px-1 py-0.5 border capitalize mt-1 inline-block ${PRIORITY_COLORS[dragging.priority]}`}>
            {dragging.priority}
          </span>
        </div>
      )}
    </>
  );
}