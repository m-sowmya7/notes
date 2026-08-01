import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLiveContext } from "../LiveContext";
import type { LiveRouteState } from "../types";

export function useLiveSession(pageId?: string) {
  const location = useLocation();
  const { connection, connected, connect, disconnect } = useLiveContext();
  const state = location.state as LiveRouteState | null;
  const isLive = Boolean(state?.live && state.sessionId && state.inviteToken && state.participantName && (!pageId || state.pageId === undefined || state.pageId === pageId));

  useEffect(() => {
    if (!isLive || !pageId || !state) return;
    connect(state.sessionId, pageId, state.inviteToken);
    return disconnect;
  }, [connect, disconnect, isLive, pageId, state?.inviteToken, state?.sessionId]);

  return {
    connection,
    connected,
    connect,
    disconnect,
    isLive,
    // Both paths carry the ID; the explicit role prevents hosts from being
    // mistaken for invitees and skipping their initial page load.
    isInvitee: Boolean(isLive && !state?.isHost),
    participantName: isLive ? state!.participantName : null,
    sessionId: isLive ? state!.sessionId : null,
    document: connection?.document ?? null,
  };
}
