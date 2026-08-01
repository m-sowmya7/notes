import { prisma } from "../prisma/client";

/**
 * A live room is deliberately different from a page. Each generated invite
 * creates one isolated Yjs document, even when multiple sessions belong to
 * the same page.
 */
const LIVE_ROOM_PREFIX = "live:";

/**
 * Until `LiveRoom.expiresAt` is added to Prisma, this is the server-side
 * expiry policy. Set LIVE_SESSION_TTL_MS to change it; the default is 24 h.
 */
const DEFAULT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export type AuthorizedLiveRoom = {
  id: string;
  pageId: string;
  inviteToken: string;
  active: boolean;
  createdBy: string;
  startedAt: Date;
  endedAt: Date | null;
  expiresAt: Date | null;
};

export function liveRoomName(roomId: string): string {
  if (!roomId) {
    throw new Error("A live room id is required");
  }

  return `${LIVE_ROOM_PREFIX}${roomId}`;
}

/** Returns null instead of accepting arbitrary Hocuspocus document names. */
export function parseLiveRoomName(documentName: string): string | null {
  if (!documentName.startsWith(LIVE_ROOM_PREFIX)) {
    return null;
  }

  const roomId = documentName.slice(LIVE_ROOM_PREFIX.length);
  return roomId.length > 0 ? roomId : null;
}

function sessionTtlMs(): number {
  const configuredTtl = Number(process.env.LIVE_SESSION_TTL_MS);

  return Number.isFinite(configuredTtl) && configuredTtl > 0
    ? configuredTtl
    : DEFAULT_SESSION_TTL_MS;
}

export function isLiveRoomExpired(
  room: Pick<AuthorizedLiveRoom, "startedAt" | "expiresAt">,
): boolean {
  const expiry = room.expiresAt?.getTime() ?? room.startedAt.getTime() + sessionTtlMs();
  return expiry <= Date.now();
}

/**
 * Validates a Hocuspocus connection. Call this from `onAuthenticate` and
 * return the result as hook context. Never trust a room name or invite token
 * supplied by the browser without this check.
 */
export async function authorizeLiveRoom(
  documentName: string,
  inviteToken: string,
): Promise<AuthorizedLiveRoom> {
  const roomId = parseLiveRoomName(documentName);
  if (!roomId) {
    throw new Error("Invalid live room name");
  }

  if (!inviteToken) {
    throw new Error("Missing live session token");
  }

  const room = await prisma.liveRoom.findUnique({
    where: { inviteToken },
    select: {
      id: true,
      pageId: true,
      inviteToken: true,
      active: true,
      createdBy: true,
      startedAt: true,
      endedAt: true,
      expiresAt: true,
    },
  });

  if (!room || room.id !== roomId) {
    throw new Error("Live session not found");
  }

  if (!room.active || room.endedAt) {
    throw new Error("Live session has ended");
  }

  if (isLiveRoomExpired(room)) {
    throw new Error("Live session has expired");
  }

  return room;
}
