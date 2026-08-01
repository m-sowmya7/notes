import { useLiveContext } from "./LiveContext";

export function useLive() {
  const { connection, connected, connect, disconnect } = useLiveContext();
  return {
    connection, connected, connect, disconnect,
    isLive: Boolean(connection),
    provider: connection?.provider ?? null,
    document: connection?.document ?? null,
  };
}
