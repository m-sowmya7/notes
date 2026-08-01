import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createLiveConnection, destroyLiveConnection } from "./provider";
import type { LiveConnection, LiveContextValue } from "./types";

const LiveContext = createContext<LiveContextValue | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const connectionRef = useRef<LiveConnection | null>(null);
  const [connection, setConnection] = useState<LiveConnection | null>(null);
  const [connected, setConnected] = useState(false);

  const disconnect = useCallback(() => {
    const current = connectionRef.current;
    if (current) destroyLiveConnection(current);
    connectionRef.current = null;
    setConnection(null);
    setConnected(false);
  }, []);

  const connect = useCallback((sessionId: string, pageId: string, inviteToken: string) => {
    const current = connectionRef.current;
    if (current?.sessionId === sessionId && current.inviteToken === inviteToken) return;
    if (current) destroyLiveConnection(current);

    const next = createLiveConnection(sessionId, pageId, inviteToken);
    next.provider.on("connect", () => setConnected(true));
    next.provider.on("disconnect", () => setConnected(false));
    connectionRef.current = next;
    setConnection(next);
  }, []);

  useEffect(() => disconnect, [disconnect]);

  return <LiveContext.Provider value={{ connection, connected, connect, disconnect }}>{children}</LiveContext.Provider>;
}

export function useLiveContext() {
  const value = useContext(LiveContext);
  if (!value) throw new Error("useLive must be used inside LiveProvider");
  return value;
}
