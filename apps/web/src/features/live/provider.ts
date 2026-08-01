import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import type { LiveConnection } from "./types";

const websocketUrl = import.meta.env.VITE_HOCUSPOCUS_URL ?? "ws://localhost:1234";

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
