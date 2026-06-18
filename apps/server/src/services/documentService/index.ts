import { PageRepository } from '../../db/repositories/documentRepository';
import { PageType } from '../../generated/prisma/enums';

export const PageService = {
    async createPage(title: string, type: PageType, content: any) {
        return PageRepository.create({title, type, content});
    },

    async getPages() {
        return PageRepository.findAll();
    },

    async getPageById(id: string) {
        return PageRepository.findById(id);
    },

    async updatePage(id: string, title: string, content: any) {
        return PageRepository.update(id, { title, content });
    },

    async deletePage(id: string) {
        return PageRepository.delete(id);
    },

    async toggleStar(id: string) {
        return PageRepository.toggleStar(id);
    },

    async getStarredPages() {
        return PageRepository.findAll().then(pages => pages.filter(page => page.starred));
    }
};