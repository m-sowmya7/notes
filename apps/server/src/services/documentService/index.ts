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
    }
};