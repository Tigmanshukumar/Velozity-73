export default function TimelineBar({
  startDate,
  dueDate,
  monthStart,
  monthEnd,
  dayWidth,
  priority,
}: any) {
  const getDayIndex = (date: Date) => date.getDate() - 1;

  // CLAMP
  const start =
    startDate && startDate > monthStart
      ? startDate
      : monthStart;

  const end = dueDate < monthEnd ? dueDate : monthEnd;

  const startIndex = startDate
    ? getDayIndex(start)
    : getDayIndex(dueDate);

  const endIndex = getDayIndex(end);

  const isSingle = !startDate;

  const left = startIndex * dayWidth;

  const width = isSingle
    ? dayWidth
    : (endIndex - startIndex + 1) * dayWidth;

  const colorMap: any = {
    critical: "bg-red-500",
    high: "bg-orange-400",
    medium: "bg-yellow-400",
    low: "bg-green-400",
  };

  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        top: "50%",
transform: "translateY(-50%)",
      }}
      className={`h-6 ${
        isSingle ? "rounded-full" : "rounded"
      } px-1 flex items-center text-[10px] text-white overflow-hidden ${colorMap[priority]}`}
    >
      {!isSingle && width > 40 && (
        <span className="truncate">
          {priority}
        </span>
      )}
    </div>
  );
}