import { randomUUID } from "crypto";
import { LiveSessionRepository } from "../repositories/liveSessionRepository";

export const LiveSessionService = {
  /**
   * Create a new live collaboration session.
   */
  async createLiveSession(pageId: string, createdBy: string) {
    const existing =
      await LiveSessionRepository.getActiveSessionByPageId(pageId);

    if (existing) {
      return existing;
    }

    const inviteToken = randomUUID();

    return LiveSessionRepository.createSession(
      pageId,
      createdBy,
      inviteToken,
      new Date(Date.now() + 1000 * 60 * 60 * 24)
    );
  },

  /**
   * Validate an invite token.
   * Used by InvitePage before the user joins.
   */
  async validateInvite(inviteToken: string) {
    const session =
      await LiveSessionRepository.getValidSessionByInviteToken(inviteToken);

    if (!session) {
      throw new Error("Invite link is invalid.");
    }

    if (!session.active) {
      throw new Error("Live session has ended.");
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      throw new Error("Invite link has expired.");
    }

    return session;
  },

  /**
   * Join a live session.
   * Currently this simply validates the session and returns page info.
   * Later this is where participant persistence can be added if required.
   */
  async joinLiveSession(
    inviteToken: string,
    participantName: string
  ) {
    const session = await this.validateInvite(inviteToken);

    return {
      id: session.id,
      inviteToken: session.inviteToken,
      participantName,
      page: session.page,
    };
  },

  /**
   * Returns whether a page already has an active live session.
   */
  async getLiveSessionStatus(pageId: string) {
    const session =
      await LiveSessionRepository.getActiveSessionByPageId(pageId);

    if (!session) {
      return {
        active: false,
      };
    }

    return {
      active: true,
      sessionId: session.id,
      inviteToken: session.inviteToken,
      createdBy: session.createdBy,
      expiresAt: session.expiresAt,
    };
  },

  /**
   * Backward-compatible alias for callers expecting the previous method name.
   */
  async getLiveSessionActiveStatus(pageId: string) {
    return this.getLiveSessionStatus(pageId);
  },

  /**
   * Lookup by invite token.
   */
  async getLiveSessionByToken(inviteToken: string) {
    return this.validateInvite(inviteToken);
  },

  async assertOwnerCanEndLiveSession(id: string, ownerId: string) {
    const session = await LiveSessionRepository.getSessionById(id);

    if (!session || !session.active) {
      throw new Error("Live session not found or has ended");
    }

    if (session.createdBy !== ownerId) {
      throw new Error("Only the page owner can end this live session");
    }

    return session;
  },


  async getExpiredLiveSessions() {
    return LiveSessionRepository.getExpiredActiveSessions();
  },

  /**
   * Mark a session as ended.
   * Hocuspocus document cleanup is handled elsewhere.
   */
  async endLiveSession(sessionId: string) {
    return LiveSessionRepository.endSession(sessionId);
  },
};

// previous service implementation for reference 
// export const LiveSessionService = {
//   async createLiveSession(pageId: string, createdBy: string) {
//     const page = await PageService.getPageById(pageId, createdBy);
//     if (!page) {
//       throw new Error("Page not found");
//     }
//     const existingSession = await LiveSessionRepository.getActiveSessionByPageId(pageId);
//     if (existingSession) {
//       await LiveSessionRepository.endSession(existingSession.id);
//     }

//     const inviteToken = crypto.randomUUID();
//     return LiveSessionRepository.createSession(
//       pageId,
//       createdBy,
//       inviteToken,
//       new Date(Date.now() + LIVE_SESSION_DURATION_MS),
//     );
//   },

//   async getLiveSessionByToken(inviteToken: string) {
//     const session = await LiveSessionRepository.getSessionByInviteToken(inviteToken);
//     if (!session || !session.active || (session.expiresAt && session.expiresAt <= new Date())) {
//       throw new Error("Live session not found or has ended");
//     }
//     return session;
//   },

//   async getLiveSessionById(id: string) {
//     return LiveSessionRepository.getSessionById(id);
//   },

//   // async getLiveSessionsByPage(pageId: string) {
//   //   return LiveSessionRepository.getActiveSessionByPageId(
//   //     pageId
//   //   )
//   // },

//   async getLiveSessionActiveStatus(pageId: string) {
//     return LiveSessionRepository.getActiveSessionByPageId(pageId);
//   },

//   async assertOwnerCanEndLiveSession(id: string, ownerId: string) {
//     const session = await LiveSessionRepository.getSessionById(id);
//     if (!session || !session.active) throw new Error("Live session not found or has ended");
//     if (session.createdBy !== ownerId) throw new Error("Only the page owner can end this live session");
//     return session;
//   },

//   async completeLiveSession(id: string) {
//     return LiveSessionRepository.endSession(id);
//   },

//   async getExpiredLiveSessions() {
//     return LiveSessionRepository.getExpiredActiveSessions();
//   },
// };
