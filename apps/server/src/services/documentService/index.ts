import { PageRepository } from '../../db/repositories/documentRepository';

export const PageService = {
    async createPage(title: string, content: any) {
        return PageRepository.create({title, content});
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