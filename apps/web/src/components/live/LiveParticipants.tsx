export type Participant = {
  id: string;
  name: string;
  color: string;
  isLocal?: boolean;
};

type Props = {
  participants: Participant[];
  maxVisible?: number;
};

export default function LiveParticipants({
  participants,
  maxVisible = 4,
}: Props) {
  const visible = participants.slice(0, maxVisible);
  const remaining = participants.length - visible.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {visible.map((user, index) => (
          <div
            key={user.id}
            title={user.name}
            aria-label={user.name}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold text-white shadow-sm ${user.isLocal ? "border-white ring-2 ring-neutral-900/15" : "border-white/90"}`}
            style={{
              backgroundColor: user.color,
              marginLeft: index === 0 ? 0 : -8,
              zIndex: visible.length - index,
            }}
          >
            {user.name.charAt(0)}
          </div>
        ))}

        {remaining > 0 && (
          <div
            title={`${remaining} more participant${remaining === 1 ? "" : "s"}`}
            className="relative -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-xs font-semibold text-neutral-700 shadow-sm"
          >
            +{remaining}
          </div>
        )}
      </div>

      <span className="text-sm font-medium text-neutral-600">
        {participants.length} {participants.length === 1 ? "person" : "people"}
      </span>
    </div>
  );
}
