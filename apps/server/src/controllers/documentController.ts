import { Request, Response } from 'express';
import { PageService } from '../services/documentService';

const getUserId = (req: Request) => req.header('x-user-id');

const serializeError = (error: unknown) => ({
    error: error instanceof Error ? error.message : String(error),
});

export const createPage = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        const { title, type, content } = req.body;
        const page = await PageService.createPage(title, type, content, userId);
        res.status(201).json(page);
    }
    catch (error) {
        res.status(500).json(serializeError(error));
    }
}

export const getPages = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        const pages = await PageService.getPages(userId);
        res.json(pages);
    }
    catch (error) {
        res.status(500).json(serializeError(error));
    }
}

export const getPageById = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        const page = await PageService.getPageById(String(req.params.id), userId);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    }
    catch (error) {
        res.status(500).json(serializeError(error));
    }
};

export const updatePage = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        const { title, content } = req.body;
        const page = await PageService.updatePage(String(req.params.id), title, content, userId);
        res.json(page);
    }
    catch (error) {
        res.status(500).json(serializeError(error));
    }
}

export const deletePage = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        await PageService.deletePage(String(req.params.id), userId);
        res.status(204).send();
    }
    catch(error) {
        res.status(500).json(serializeError(error));
    }
}

export const toggleStar = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const page = await PageService.toggleStar(String(req.params.id), userId);
    res.json(page);
  } catch (error) {
    res.status(500).json(serializeError(error));
  }
};

export const getStarredPages = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: 'Missing user id' });

        const pages = await PageService.getStarredPages(userId);
        res.json(pages);
    }
    catch(error) {
        res.status(500).json(serializeError(error));
    }
}
