import LiveParticipants, { type Participant } from "./LiveParticipants";
import LiveStatus from "./LiveStatus";

export default function LiveToolbar({ participants, connected }: { participants: Participant[]; connected: boolean }) {
  return <div className="flex items-center gap-3"><LiveStatus connected={connected} /><LiveParticipants participants={participants} /></div>;
}
