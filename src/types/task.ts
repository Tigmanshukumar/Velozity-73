export type Status = "todo" | "inprogress" | "review" | "done";

export type View = "list" | "kanban" | "timeline";

export type Priority = "low" | "medium" | "high" | "critical";

export type Task = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;

  // optional → used for timeline range
  startDate?: string;

  // required → used everywhere
  dueDate: string;
};