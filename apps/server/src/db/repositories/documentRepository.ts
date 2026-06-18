import { prisma } from '../prisma/client';
import { PageType } from '../../generated/prisma/enums';

export const PageRepository = {
    create(data: {
        title: string;
        type: PageType;
        content: any;
    }) {
        return prisma.page.create({
            data,
        });
    },

    findAll() {
        return prisma.page.findMany({
            orderBy: {
                updatedAt: "desc",
            },
        });
    },

    findById(id: string) {
        return prisma.page.findUnique({
            where: {id},
        });
    },

    update(
        id: string,
        data: {
            title?: string;
            content?: any;
        }
    ) {
        return prisma.page.update({
            where: {id},
            data,
        });
    },

    delete(id: string) {
        return prisma.page.delete({ where: { id } });
    },

    async toggleStar(id: string) {
        const page = await prisma.page.findUnique({ where: { id } });
        return prisma.page.update({
            where: { id },
            data: {
                starred: !page?.starred
            }
        })
    }
};