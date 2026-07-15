import { PageRepository } from '../repositories/documentRepository';
import { PageType } from '../generated/prisma/enums';

// all the business logic for pages will be here, this is where we will call the repository functions
export const PageService = {
    async createPage(title: string, type: PageType, content: any, ownerId: string) {

        switch (type) {
            case PageType.MARKDOWN:
                content = {};
                break;

            case PageType.LIST:
                content = {
                    items: [],
                };
                break;

            case PageType.KANBAN:
                content = {
                    columns: [],
                    cards: [],
                };
                break;
        }

        return PageRepository.create({
            title: "",
            ownerId,
            type,
            content,
        });
        // return PageRepository.create({title, type, content, ownerId});
    },

    async getPages(ownerId: string) {
        return PageRepository.findAll(ownerId);
    },

    async getPageById(id: string, ownerId: string) {
        return PageRepository.findById(id, ownerId);
    },

    async updatePage(id: string, title: string, content: any, ownerId: string) {
        return PageRepository.update(id, ownerId, { title, content });
    },

    async deletePage(id: string, ownerId: string) {
        return PageRepository.delete(id, ownerId);
    },

    async toggleStar(id: string, ownerId: string) {
        return PageRepository.toggleStar(id, ownerId);
    },

    async getStarredPages(ownerId: string) {
        return PageRepository.findAll(ownerId).then(pages => pages.filter(page => page.starred));
    }
};