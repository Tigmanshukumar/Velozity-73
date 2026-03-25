import { create } from "zustand";

export type CollabUser = {
  id: string;
  name: string;
  color: string;
  taskId: string | null;
};

type CollabStore = {
  users: CollabUser[];
  startSimulation: (taskIds: string[]) => void;
  stopSimulation: () => void;
  _interval: ReturnType<typeof setInterval> | null;
};

const USERS: Omit<CollabUser, "taskId">[] = [
  { id: "u1", name: "Alice", color: "#7C3AED" },
  { id: "u2", name: "Bob", color: "#0891B2" },
  { id: "u3", name: "Carol", color: "#D97706" },
  { id: "u4", name: "Dan", color: "#DC2626" },
];

export const useCollabStore = create<CollabStore>((set, get) => ({
  users: USERS.map((u) => ({ ...u, taskId: null })),
  _interval: null,

  startSimulation: (taskIds: string[]) => {
    if (get()._interval) return;

    // Assign initial positions
    set({
      users: USERS.map((u, i) => ({
        ...u,
        taskId: taskIds[i % taskIds.length] ?? null,
      })),
    });

    const interval = setInterval(() => {
      if (taskIds.length === 0) return;
      set((state) => ({
        users: state.users.map((user) => {
          // ~30% chance to move each tick
          if (Math.random() > 0.3) return user;
          const newTaskId = taskIds[Math.floor(Math.random() * taskIds.length)];
          return { ...user, taskId: newTaskId };
        }),
      }));
    }, 2500);

    set({ _interval: interval });
  },

  stopSimulation: () => {
    const interval = get()._interval;
    if (interval) clearInterval(interval);
    set({ _interval: null, users: USERS.map((u) => ({ ...u, taskId: null })) });
  },
}));