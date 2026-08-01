import { useEffect, useState } from "react";
import { createLocalUser } from "../awareness";
import type { LiveUser } from "../types";
import type { LiveConnection } from "../types";

export function usePresence(connection: LiveConnection | null, participantName: string | null): LiveUser[] {
  const [participants, setParticipants] = useState<LiveUser[]>([]);
  useEffect(() => {
    if (!connection || !participantName) { setParticipants([]); return; }
    const awareness = connection.provider.awareness;
    if (!awareness) return;
    const local = createLocalUser(participantName);
    awareness.setLocalStateField("user", local);
    const update = () => setParticipants(Array.from(awareness.getStates().values()).flatMap((state) => {
      const user = (state as { user?: LiveUser }).user;
      return user ? [user] : [];
    }));
    awareness.on("change", update); update();
    return () => { awareness.off("change", update); awareness.setLocalState(null); };
  }, [connection, participantName]);
  return participants;
}
