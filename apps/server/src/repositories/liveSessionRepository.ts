import { prisma } from "../prisma/client";

// Repository responsible only for database operations related to Live Rooms.
export const LiveSessionRepository = {
  /**
   * Create a new live collaboration session.
   */
  createSession(
    pageId: string,
    createdBy: string,
    inviteToken: string,
    expiresAt: Date
  ) {
    return prisma.liveRoom.create({
      data: {
        pageId,
        createdBy,
        inviteToken,
        expiresAt,
      },
      include: {
        page: true,
      },
    });
  },

  /**
   * Find a session by its database ID.
   */
  getSessionById(id: string) {
    return prisma.liveRoom.findUnique({
      where: { id },
      include: {
        page: true,
      },
    });
  },

  /**
   * Find a session using its invite token.
   */
  getSessionByInviteToken(inviteToken: string) {
    return prisma.liveRoom.findUnique({
      where: { inviteToken },
      include: {
        page: true,
      },
    });
  },

  /**
   * Returns only an active & non-expired session for an invite token.
   */
  getValidSessionByInviteToken(inviteToken: string) {
    return prisma.liveRoom.findFirst({
      where: {
        inviteToken,
        active: true,
        OR: [
          { expiresAt: null },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      include: {
        page: true,
      },
    });
  },

  /**
   * Returns the currently active session for a page.
   */
  getActiveSessionByPageId(pageId: string) {
    return prisma.liveRoom.findFirst({
      where: {
        pageId,
        active: true,
        OR: [
          { expiresAt: null },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      include: {
        page: true,
      },
    });
  },

  /**
   * Returns the active session by ID.
   */
  getActiveSessionById(id: string) {
    return prisma.liveRoom.findFirst({
      where: {
        id,
        active: true,
      },
      include: {
        page: true,
      },
    });
  },

  /**
   * Returns the latest session for a page
   * (active or inactive).
   */
  getSessionByPageId(pageId: string) {
    return prisma.liveRoom.findFirst({
      where: {
        pageId,
      },
      include: {
        page: true,
      },
    });
  },

  /**
   * Returns all expired sessions that are still marked active.
   */
  getExpiredActiveSessions() {
    return prisma.liveRoom.findMany({
      where: {
        active: true,
        expiresAt: {
          lte: new Date(),
        },
      },
      select: {
        id: true,
      },
    });
  },

  /**
   * Save the latest Yjs document state.
   */
  updateYjsState(id: string, yjsState: Buffer | Uint8Array<ArrayBuffer>) {
    const normalizedYjsState = Buffer.isBuffer(yjsState)
      ? new Uint8Array(
          yjsState.buffer.slice(
            yjsState.byteOffset,
            yjsState.byteOffset + yjsState.byteLength
          ) as ArrayBuffer
        )
      : yjsState;

    return prisma.liveRoom.update({
      where: {
        id,
      },
      data: {
        yjsState: normalizedYjsState,
      },
    });
  },

  /**
   * Clear the persisted Yjs state.
   * Optional, but useful when a room is ended.
   */
  clearYjsState(id: string) {
    return prisma.liveRoom.update({
      where: {
        id,
      },
      data: {
        yjsState: null,
      },
    });
  },

  /**
   * Mark a session as ended.
   */
  endSession(id: string) {
    return prisma.liveRoom.update({
      where: {
        id,
      },
      data: {
        active: false,
        endedAt: new Date(),
        expiresAt: new Date(),
      },
    });
  },

  /**
   * Returns the number of active sessions.
   */
  countActiveSessions() {
    return prisma.liveRoom.count({
      where: {
        active: true,
      },
    });
  },
};