import { prisma } from "../../prisma/client";
import { AccessLevel } from "../generated/prisma/enums";

export const ShareRepository = {
    async sharePages(
        pageId: string,
        userId: string,
        access: AccessLevel
    ) {
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
                pageId, userId, access
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
            }
        })
    },

    async revokeShare(pageId: string, userId: string) {
        return prisma.pageShare.delete({
            where: {
                // why do we user _ here? does it indicate combined
                pageId_userId: {
                    pageId,
                    userId
                },
            },
        });
    }
}