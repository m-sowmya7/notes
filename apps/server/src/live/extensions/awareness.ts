// This manages presence, not document content.
// Think Google Docs people who are present in the document.
// Nothing in here gets stored permanently. If everyone disconnects everything disappears.
import type {
  onAwarenessUpdatePayload,
  onConnectPayload,
  onDisconnectPayload,
} from "@hocuspocus/server";

// Awareness is transient Yjs state. The frontend reads participant identities
// from provider.awareness; it must never be written to Prisma.
const presenceLoggingEnabled = process.env.LIVE_PRESENCE_LOGS === "true";

export async function onConnect({ documentName }: onConnectPayload) {
  if (presenceLoggingEnabled) console.info(`[live] connecting to ${documentName}`);
}

export async function onAwarenessUpdate({ documentName, states }: onAwarenessUpdatePayload) {
  if (presenceLoggingEnabled) {
    console.info(`[live] ${documentName}: ${states.length} participant(s) present`);
  }
}

export async function onDisconnect({ documentName }: onDisconnectPayload) {
  if (presenceLoggingEnabled) console.info(`[live] disconnected from ${documentName}`);
}
