import { useFilterStore } from "../store/useFilterStore";
import { useTaskStore } from "../store/useTaskStore";
import type { Status, Priority } from "../types/task";

const STATUSES: Status[] = ["todo", "inprogress", "review", "done"];
const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "In Review",
  done: "Done",
};
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];

export default function FilterBar() {
  const { filters, setFilter, clearFilters } = useFilterStore();
  const tasks = useTaskStore((s) => s.tasks);
  const assignees = Array.from(new Set(tasks.map((t) => t.assignee))).sort();

  const hasActive =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  function toggle<T extends string>(arr: T[], val: T, set: (v: T[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  return (
    <div className="border p-2 mb-4 bg-white text-sm">
      <div className="flex flex-wrap gap-4 items-start">

        {/* Status */}
        <div>
          <div className="text-xs text-gray-400 mb-1">STATUS</div>
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => toggle(filters.status, s, (v) => setFilter("status", v))}
                className={`text-xs px-2 py-0.5 border ${
                  filters.status.includes(s)
                    ? "bg-gray-200"
                    : "bg-white"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <div className="text-xs text-gray-400 mb-1">PRIORITY</div>
          <div className="flex gap-1 flex-wrap">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => toggle(filters.priority, p, (v) => setFilter("priority", v))}
                className={`text-xs px-2 py-0.5 border capitalize ${
                  filters.priority.includes(p)
                    ? "bg-gray-200"
                    : "bg-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div>
          <div className="text-xs text-gray-400 mb-1">ASSIGNEE</div>
          <div className="flex gap-1 flex-wrap">
            {assignees.map((a) => (
              <button
                key={a}
                onClick={() => toggle(filters.assignee, a, (v) => setFilter("assignee", v))}
                className={`text-xs px-2 py-0.5 border ${
                  filters.assignee.includes(a)
                    ? "bg-gray-200"
                    : "bg-white"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div>
          <div className="text-xs text-gray-400 mb-1">DUE DATE</div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
              className="text-xs border px-1 py-0.5"
            />
            <span>–</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilter("dateTo", e.target.value)}
              className="text-xs border px-1 py-0.5"
            />
          </div>
        </div>

        {/* Clear */}
        {hasActive && (
          <div className="flex items-end pb-0.5">
            <button
              onClick={clearFilters}
              className="text-xs text-red-500 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}