import { create } from "zustand";
import type { Task, View } from "../types/task";
import { generateTasks } from "../utils/generateTasks";

type Store = {
  tasks: Task[];
  view: View;

  

  setView: (view: View) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
};


export const useTaskStore = create<Store>((set) => ({
  tasks: generateTasks(500),

  // default view
  view: "list",

  // switch views
  setView: (view) => set({ view }),

  

  // update task (status, etc.)
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
}));