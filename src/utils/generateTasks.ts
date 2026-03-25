import type { Task, Status, Priority } from "../types/task";

const statuses: Status[] = ["todo", "inprogress", "review", "done"];
const priorities: Priority[] = ["low", "medium", "high", "critical"];
const users = ["A", "B", "C", "D", "E", "F"];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateTasks(count = 500): Task[] {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // ~20% tasks are overdue (due date in the past)
    const isOverdue = Math.random() < 0.2;
    const due = isOverdue
      ? randomDate(new Date(now.getFullYear(), now.getMonth() - 3, 1), now)
      : randomDate(new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), 11, 31));

    const hasStart = Math.random() > 0.3;

    tasks.push({
      id: crypto.randomUUID(),
      title: `Task ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: users[Math.floor(Math.random() * users.length)],
      startDate: hasStart ? randomDate(new Date(now.getFullYear(), now.getMonth() - 2, 1), due).toISOString() : undefined,
      dueDate: due.toISOString(),
    });
  }

  return tasks;
}