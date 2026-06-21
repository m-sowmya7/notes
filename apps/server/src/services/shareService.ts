import { ShareRepository } from "../repositories/shareRepository";
import { AccessLevel } from "../generated/prisma/enums";

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