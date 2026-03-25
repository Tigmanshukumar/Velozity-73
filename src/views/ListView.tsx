import { useState, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useFilterStore } from "../store/useFilterStore";
import type { Task, Status } from "../types/task";

const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};
const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do", inprogress: "In Progress", review: "In Review", done: "Done",
};

const ROW_H = 50;
const CONTAINER_H = 500;
const BUFFER = 5;

export default function ListView() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const { filters, clearFilters } = useFilterStore();

  const [sortKey, setSortKey] = useState<"title" | "priority" | "dueDate">("title");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [scrollTop, setScrollTop] = useState(0);

  function handleSort(key: typeof sortKey) {
    if (key === sortKey) setDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDir("asc"); }
  }

  const filtered = useMemo(() => tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assignee)) return false;
    if (filters.dateFrom && new Date(t.dueDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(t.dueDate) > new Date(filters.dateTo)) return false;
    return true;
  }), [tasks, filters]);

  const sorted = useMemo(() => [...filtered].sort((a: Task, b: Task) => {
    let diff = 0;
    if (sortKey === "dueDate") diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    else if (sortKey === "priority") diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    else diff = (parseInt(a.title.match(/\d+/)?.[0] ?? "0") - parseInt(b.title.match(/\d+/)?.[0] ?? "0"));
    return dir === "asc" ? diff : -diff;
  }), [filtered, sortKey, dir]);

  const total = sorted.length;
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER);
  const end = Math.min(total, start + Math.ceil(CONTAINER_H / ROW_H) + BUFFER * 2);
  const visible = sorted.slice(start, end);
  const today = new Date();

  const hasFilters = filters.status.length > 0 || filters.priority.length > 0 ||
    filters.assignee.length > 0 || !!filters.dateFrom || !!filters.dateTo;

  function thCls(key: typeof sortKey) {
    return `p-3 text-left text-sm font-medium cursor-pointer select-none ${sortKey === key ? "bg-gray-100" : ""}`;
  }

  return (
    <div
      className="border overflow-auto h-[500px]"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white border-b z-10">
          <tr>
            <th className={thCls("title")} onClick={() => handleSort("title")}>
              Title {sortKey === "title" && (dir === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-left text-sm font-medium">Status</th>
            <th className={thCls("priority")} onClick={() => handleSort("priority")}>
              Priority {sortKey === "priority" && (dir === "asc" ? "↑" : "↓")}
            </th>
            <th className={thCls("dueDate")} onClick={() => handleSort("dueDate")}>
              Due Date {sortKey === "dueDate" && (dir === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ height: start * ROW_H }} />

          {total === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-16 text-gray-400">
                <div className="mb-2 text-gray-500">No tasks match your filters</div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 underline">
                    Clear filters
                  </button>
                )}
              </td>
            </tr>
          ) : (
            visible.map((task) => {
              const due = new Date(task.dueDate);
              const isToday = due.toDateString() === today.toDateString();
              const isOverdue = due < today && !isToday;
              const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
              return (
                <tr key={task.id} className="border-t" style={{ height: ROW_H }}>
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3">
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
                      className="text-xs border px-1 py-1"
                    >
                      {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-1 py-0.5 border capitalize ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className={`p-3 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
                    {isToday ? "Due Today" : isOverdue && days > 7 ? `${days} days overdue` : due.toLocaleDateString()}
                  </td>
                </tr>
              );
            })
          )}

          <tr style={{ height: (total - end) * ROW_H }} />
        </tbody>
      </table>
    </div>
  );
}