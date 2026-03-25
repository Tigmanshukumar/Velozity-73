export default function TimelineHeader({
  daysInMonth,
  dayWidth,
}: {
  daysInMonth: number;
  dayWidth: number;
}) {
  const today = new Date();
  const todayDate = today.getDate();

  return (
   <div className="flex border-b relative bg-white h-10 w-fit">
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;

        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          day
        );

        const weekday = ["S", "M", "T", "W", "T", "F", "S"][
          date.getDay()
        ];

        return (
          <div
            key={day}
            style={{ width: dayWidth }}
            className="text-xs text-center border-r py-1"
          >
            <div>{day}</div>
            <div className="text-[10px] text-gray-400">
              {weekday}
            </div>
          </div>
        );
      })}

      {/* TODAY LINE */}
      <div
        style={{
          position: "absolute",
          left: (todayDate - 1) * dayWidth,
          top: 0,
          bottom: 0,
        }}
        className="w-[2px] bg-red-500"
      />
    </div>
  );
}