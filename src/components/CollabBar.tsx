import { useCollabStore } from "../store/useCollabStore";

export default function CollabBar() {
  const users = useCollabStore((state) => state.users);
  const active = users.filter((u) => u.taskId !== null);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
      <span className="w-2 h-2 bg-green-500 inline-block" />
      <span>
        <strong>{active.length}</strong> {active.length === 1 ? "person is" : "people are"} viewing this board
      </span>
      <div className="flex ml-1" style={{ gap: 0 }}>
        {active.map((u, i) => (
          <div
            key={u.id}
            title={u.name}
            style={{
              backgroundColor: u.color,
              marginLeft: i === 0 ? 0 : -6,
              zIndex: active.length - i,
            }}
            className="w-6 h-6 border flex items-center justify-center text-white text-[10px] font-bold"
          >
            {u.name[0]}
          </div>
        ))}
      </div>
    </div>
  );
}