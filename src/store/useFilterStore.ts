import { create } from "zustand";
import type { Status, Priority } from "../types/task";

export type Filters = {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateFrom: string;
  dateTo: string;
};

type FilterStore = {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  loadFromURL: () => void;
  syncToURL: (filters: Filters) => void;
};

const emptyFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
  dateFrom: "",
  dateTo: "",
};

function parseURL(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    status: params.getAll("status") as Status[],
    priority: params.getAll("priority") as Priority[],
    assignee: params.getAll("assignee"),
    dateFrom: params.get("dateFrom") ?? "",
    dateTo: params.get("dateTo") ?? "",
  };
}

function writeURL(filters: Filters) {
  const params = new URLSearchParams();
  filters.status.forEach((s) => params.append("status", s));
  filters.priority.forEach((p) => params.append("priority", p));
  filters.assignee.forEach((a) => params.append("assignee", a));
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);

  const newURL =
    params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

  window.history.pushState({}, "", newURL);
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: parseURL(),

  setFilter: (key, value) => {
    const updated = { ...get().filters, [key]: value };
    writeURL(updated);
    set({ filters: updated });
  },

  clearFilters: () => {
    writeURL(emptyFilters);
    set({ filters: { ...emptyFilters } });
  },

  loadFromURL: () => {
    set({ filters: parseURL() });
  },

  syncToURL: (filters) => {
    writeURL(filters);
  },
}));