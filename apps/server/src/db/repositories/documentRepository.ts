import { prisma } from '../prisma/client';

export const PageRepository = {
    create(data: {
        title: string;
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
};