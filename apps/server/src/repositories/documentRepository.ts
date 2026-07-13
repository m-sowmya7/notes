import { prisma } from "../prisma/client";
import { PageType } from "../generated/prisma/enums";

// functions that are used to interact with the database related to pages
export const PageRepository = {
  create(data: {
    title: string;
    ownerId: string;
    type: PageType;
    content: any;
  }) {
    return prisma.page.create({ data });
  },

  findAll(ownerId: string) {
    return prisma.page.findMany({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });
  },

  findById(id: string, ownerId: string) {
    return prisma.page.findFirst({
      where: { id, ownerId },
    });
  },

  update(
    id: string,
    ownerId: string,
    data: {
      title?: string;
      content?: any;
    },
  ) {
    return prisma.page.update({
      where: { id, ownerId },
      data,
    });
  },

  delete(id: string, ownerId: string) {
    return prisma.page.delete({ where: { id, ownerId } });
  },

  async toggleStar(id: string, ownerId: string) {
    const page = await prisma.page.findFirst({ where: { id, ownerId } });
    if (!page) {
      throw new Error("Page not found for toggle star function");
    }
    return prisma.page.update({
      where: { id, ownerId },
      data: { starred: !page?.starred },
    });
  },
};
