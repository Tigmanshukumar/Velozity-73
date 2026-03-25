import { useEffect } from "react";
import { useTaskStore } from "./store/useTaskStore";
import { useFilterStore } from "./store/useFilterStore";
import { useCollabStore } from "./store/useCollabStore";
import ListView from "./views/ListView";
import KanbanView from "./views/KanbanView";
import TimelineView from "./views/TimelineView";
import FilterBar from "./components/FilterBar";
import CollabBar from "./components/CollabBar";

export default function App() {
  const view = useTaskStore((s) => s.view);
  const setView = useTaskStore((s) => s.setView);
  const tasks = useTaskStore((s) => s.tasks);
  const loadFromURL = useFilterStore((s) => s.loadFromURL);
  const startSimulation = useCollabStore((s) => s.startSimulation);
  const stopSimulation = useCollabStore((s) => s.stopSimulation);

  useEffect(() => {
    const ids = tasks.slice(0, 80).map((t) => t.id);
    startSimulation(ids);
    return () => stopSimulation();
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", loadFromURL);
    return () => window.removeEventListener("popstate", loadFromURL);
  }, []);

  return (
    <div className="p-4">
      <CollabBar />

      <div className="flex gap-2 mb-4">
        {(["list", "kanban", "timeline"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1 border text-sm capitalize ${
              view === v ? "bg-gray-200 font-bold" : "bg-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <FilterBar />

      {view === "list" && <ListView />}
      {view === "kanban" && <KanbanView />}
      {view === "timeline" && <TimelineView />}
    </div>
  );
}