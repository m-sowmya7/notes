import { prisma } from "../prisma/client";
import { AccessLevel } from "../generated/prisma/enums";

// ShareRepository is for sharing the pages with other users when the reciever id is known (not used for now)
export const ShareRepository = {
  async sharePages(pageId: string, userId: string, access: AccessLevel) {
    return prisma.pageShare.upsert({
      where: {
        pageId_userId: {
          pageId,
          userId,
        },
      },
      update: {
        access,
      },
      create: {
        pageId,
        userId,
        access,
      },
    });
  },

  async getSharedUsers(pageId: string) {
    return prisma.pageShare.findMany({
      where: {
        pageId,
      },
      // what does include do in prisma?
      include: {
        user: true,
      },
    });
  },

  async revokeShare(pageId: string, userId: string) {
    return prisma.pageShare.delete({
      where: {
        // why do we user _ here? does it indicate combined
        pageId_userId: {
          pageId,
          userId,
        },
      },
    });
  },
};

// ShareLinkRepository is connection of database with the share functionality of the application
export const ShareLinkRepository = {
  create(pageId: string, token: string, access: AccessLevel) {
    return prisma.shareLink.create({
      data: { pageId, token, access },
    });
  },

  findByToken(token: string) {
    return prisma.shareLink.findUnique({
      where: { token },
      // why are we including page here? what does include do in prisma? look at the bottom for answer
      include: { page: true },
    });
  },

  findByPage(pageId: string) {
    return prisma.shareLink.findMany({
      where: { pageId },
      orderBy: { createdAt: "desc" }, // recently created links will be at the top of the list
    });
  },

  findReusableByPageAndAccess(pageId: string, access: AccessLevel) {
    return prisma.shareLink.findFirst({
      where: {
        pageId,
        access,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "asc" },
    });
  },

  update(id: string, data: Partial<{ access: AccessLevel; expiresAt: Date }>) {
    return prisma.shareLink.update({
      where: { id },
      data,
      // The id passed to where is only used to locate the record to update.
      // The fields that actually get updated are only those inside data.
    });
  },

  delete(id: string) {
    return prisma.shareLink.delete({
      where: { id },
    });
  },
};

// LiveSessionRepository is for managing live collaboration sessions, including creating, retrieving, and ending sessions.
export const LiveSessionRepository = {
  createSession(pageId: string, createdBy: string, inviteToken: string) {
    return prisma.liveRoom.create({
      data: { pageId, createdBy, inviteToken },
    });
  },

  getSessionById(id: string) {
    return prisma.liveRoom.findUnique({
      where: { id },
      include: { page: true },
    });
  },

  getSessionByInviteToken(inviteToken: string) {
    return prisma.liveRoom.findUnique({
      where: { inviteToken },
      include: { page: true }, // include the associated page in the result
    });
  },

  getActiveSessionByPageId(pageId: string) {
    return prisma.liveRoom.findFirst({
      where: { pageId, active: true },
    });
  },

  getActiveSession(id: string) {
    return prisma.liveRoom.findFirst({
      where: { active: true, id },
    });
  },

  endSession(id: string) {
    return prisma.liveRoom.update({
      where: { id },
      data: {
        active: false,
        endedAt: new Date(), // set the expiration time to now
      },
    });
  },

  // optional function to delete expired sessions (dont think we need this now, has to be a cron job so for optimization and scaling)
  // deleteExpiredSessions() { }
};

// ============================================================================================
// Since you're looking up a share link, you'll almost always want to know which page it points to. Including the page saves you from making a second database query like:
// const shareLink = await prisma.shareLink.findUnique({ where: { token } });
// const page = await prisma.page.findUnique({ where: { id: shareLink.pageId } });
// Instead, Prisma retrieves both the ShareLink and its associated Page in one call, making your code simpler and reducing database round trips.
