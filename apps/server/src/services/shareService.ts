import {
  ShareRepository,
  ShareLinkRepository,
  LiveSessionRepository,
} from "../repositories/shareRepository";
import { AccessLevel } from "../generated/prisma/enums";
import { prisma } from "../prisma/client";
import { PageService } from "./documentService";
import crypto from "crypto";

// not being used for now
export const ShareService = {
  async sharePage(pageId: string, userId: string, access: AccessLevel) {
    return ShareRepository.sharePages(pageId, userId, access);
  },

  async getSharedUsers(pageId: string) {
    return ShareRepository.getSharedUsers(pageId);
  },

  async removeShare(pageId: string, userId: string) {
    return ShareRepository.revokeShare(pageId, userId);
  },
};

export const ShareLinkService = {
  async createShareLink(pageId: string, access: AccessLevel) {
    const existingLink =
      await ShareLinkRepository.findReusableByPageAndAccess(pageId, access);
    if (existingLink) {
      return existingLink;
    }

    const token = crypto.randomBytes(16).toString("hex");
    if (!token) {
      throw new Error("Failed to generate share link token");
    }
    return ShareLinkRepository.create(pageId, token, access);
  },

  async getSharePageByToken(token: string) {
    const link = await ShareLinkRepository.findByToken(token);
    if (!link) {
      throw new Error("Share link not found");
    }
    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new Error("Share link has expired");
    }
    return link;
  },

  async getPageLinks(pageId: string) {
    return ShareLinkRepository.findByPage(pageId);
  },

  async updateSharedPage(
    pageId: string,
    data: { title?: string; content?: any },
  ) {
    return prisma.page.update({
      where: { id: pageId },
      data,
    });
  },

  async deleteShareLink(id: string) {
    return ShareLinkRepository.delete(id);
  },
};

export const LiveSessionService = {
  async createLiveSession(pageId: string, createdBy: string) {
    const page = await PageService.getPageById(pageId, createdBy);
    if (!page) {
      throw new Error("Page not found");
    }
    const existingSession = await LiveSessionRepository.getActiveSessionByPageId(pageId);
    if (existingSession) {
      await LiveSessionRepository.endSession(existingSession.id);
    }

    const inviteToken = crypto.randomUUID();
    return LiveSessionRepository.createSession(pageId, createdBy, inviteToken);
  },

  async getLiveSessionByToken(inviteToken: string) {
    const session = await LiveSessionRepository.getSessionByInviteToken(inviteToken);
    if (!session || !session.active) {
      throw new Error("Live session not found or has ended");
    }
    return session;
  },

  async getLiveSessionById(id: string) {
    return LiveSessionRepository.getSessionById(id);
  },

  // async getLiveSessionsByPage(pageId: string) {
  //   return LiveSessionRepository.getActiveSessionByPageId(
  //     pageId
  //   )
  // },

  async getLiveSessionActiveStatus(pageId: string) {
    return LiveSessionRepository.getActiveSession(pageId);
  },

  async endLiveSession(id: string) {
    return LiveSessionRepository.endSession(id);
  },
};
