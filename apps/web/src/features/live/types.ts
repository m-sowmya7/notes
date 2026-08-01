import type { HocuspocusProvider } from "@hocuspocus/provider";
import type * as Y from "yjs";

export type PageType = "MARKDOWN" | "LIST" | "KANBAN";

export interface LiveSessionResponse {
  sessionId: string;
  pageId: string;
  inviteToken: string;
  url: string;
}

export interface LiveInvite {
  sessionId: string;
  pageId: string;
  pageType: PageType;
  pageTitle: string;
  active: boolean;
  expiresAt?: string | null;
}

export interface LiveRouteState {
  live: true;
  sessionId: string;
  inviteToken: string;
  participantName: string;
  pageId?: string;
  isHost?: boolean;
}

export interface LiveUser { id: string; name: string; color: string }
export interface AwarenessState { user?: LiveUser; cursor?: { x: number; y: number } | null }

export interface LiveConnection {
  provider: HocuspocusProvider;
  document: Y.Doc;
  sessionId: string;
  pageId: string;
  inviteToken: string;
}

export interface LiveContextValue {
  connection: LiveConnection | null;
  connected: boolean;
  connect: (sessionId: string, pageId: string, inviteToken: string) => void;
  disconnect: () => void;
}
