import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import type { LiveConnection } from "./types";
import { apiBaseUrl } from "../../utils/runtimeConfig";

/**
 * The WebSocket must point at a server the viewer can actually reach. Deriving
 * it from the REST API origin (VITE_BACKEND_URL) means invitees connect to the
 * same host the app already talks to — not their own localhost.
 */
function resolveWebSocketUrl(): string {
  const explicit = import.meta.env.VITE_HOCUSPOCUS_URL;
  if (explicit) return explicit;

  const origin = new URL(apiBaseUrl, window.location.origin).origin;
  const protocol = origin.startsWith("https:") ? "wss:" : "ws:";
  return `${protocol}//${origin.replace(/^https?:\/\//, "")}/ws`;
}

const websocketUrl = resolveWebSocketUrl();

export function createLiveConnection(sessionId: string, pageId: string, inviteToken: string): LiveConnection {
  const document = new Y.Doc();
  const provider = new HocuspocusProvider({
    url: websocketUrl,
    name: `live:${sessionId}`,
    document,
    token: inviteToken,
  });
  return { provider, document, sessionId, pageId, inviteToken };
}

export function destroyLiveConnection(connection: LiveConnection) {
  connection.provider.destroy();
  connection.document.destroy();
}
