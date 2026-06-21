import { ShareRepository, ShareLinkRepository } from "../repositories/shareRepository";
import { AccessLevel } from "../generated/prisma/enums";
import crypto from "crypto";

export const ShareService = {
  async sharePage(pageId: string, userId: string, access: AccessLevel) {
    return ShareRepository.sharePages(
      pageId,
      userId,
      access
    );
  },

  async getSharedUsers(pageId: string) {
    return ShareRepository.getSharedUsers(
      pageId
    );
  },

  async removeShare(pageId: string, userId: string) {
    return ShareRepository.revokeShare(
      pageId,
      userId
    );
  },
};

export const ShareLinkService = {
  async createShareLink(pageId: string, access: AccessLevel) {
    const token = crypto.randomBytes(16).toString("hex");
    return ShareLinkRepository.create(pageId, token, access);
  },

  async getSharePageByToken(token: string) {
    const link = await ShareLinkRepository.findByToken(token);
    if (!link) {
      throw new Error("Share link not found");
    }
    if(link.expiresAt && link.expiresAt < new Date()) {
      throw new Error("Share link has expired");
    }
    return link;
  },

  async getPageLinks(pageId: string) {
    return ShareLinkRepository.findByPage(pageId);
  },

  async deleteShareLink(id: string) {
    return ShareLinkRepository.delete(id);
  }
}