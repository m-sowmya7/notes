import { Request, Response } from 'express';
import { PageService } from '../services/documentService';

export const createPage = async (req: Request, res: Response) => {
    try {
        const {title, content} = req.body;

        const page = await PageService.createPage(title, content);

        res.status(201).json(page);
    }
    catch(error) {
        res.status(500).json(error);
    }
}

export const getPages = async (req: Request, res: Response) => {
    const pages = await PageService.getPages();
    res.json(pages);
}

export const getPageById = async (req: Request, res: Response) => {
    try {
        const page = await PageService.getPageById(String(req.params.id));
        if(!page) {
            return res.status(404).json({message: "Page not found"});
        }
        res.json(page);
    }
    catch(error) {
        res.status(500).json(error);
    }
};

export const updatePage = async (req: Request, res: Response) => {
    try {
        const {title, content} = req.body;
        const page = await PageService.updatePage(String(req.params.id), title, content);
        res.json(page);
    }
    catch(error) {
        res.status(500).json(error);
    }
}