// 1. remove mock data and replace with actual data
// 2. add a way to show the number of participants in the live session and display all the names list
// 3. skeptical on the css
// 4. on hover of the participant, show the name of the participant
export type Participant = {
  id: string;
  name: string;
  color: string;
};

export const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Careful Moose",
    color: "#8385df",
  },
  {
    id: "2",
    name: "Brave Fox",
    color: "#5bd1aa",
  },
  {
    id: "3",
    name: "Tiny Panda",
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "Silent Owl",
    color: "#EF4444",
  },
  {
    id: "5",
    name: "Happy Duck",
    color: "#8B5CF6",
  },
  {
    id: "6",
    name: "Calm Bear",
    color: "#06B6D4",
  },
];

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
    <div className="flex items-center">
      {visible.map((user, index) => (
        <div
          key={user.id}
          title={user.name}
          className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-xs font-semibold text-white"
          style={{
            backgroundColor: user.color,
            marginLeft: index === 0 ? 0 : -8,
            opacity: 1- index * 0.1,
            zIndex: visible.length - index,
          }}
        >
          {user.name.charAt(0)}
        </div>
      ))}

      {remaining > 0 && (
        <div
          className="relative -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-semibold text-neutral-700"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}