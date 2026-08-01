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

