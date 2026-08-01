import {
  ShareRepository,
  ShareLinkRepository,
} from "../repositories/shareRepository";
import { AccessLevel } from "../generated/prisma/enums";
import { prisma } from "../prisma/client";
import { PageService } from "./documentService";
import crypto from "crypto";

const LIVE_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

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


