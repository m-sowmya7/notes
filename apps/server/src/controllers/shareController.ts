import { Request, Response } from 'express';
import { ShareService, ShareLinkService } from '../services/shareService';
import dotenv from 'dotenv';
dotenv.config();

export const sharePage = async (req: Request, res: Response) => {
    try {
        // why do i have to store like this? why cant i just do req.params.pageId?
        const { pageId: rawPageId } = req.params;
        const { userId, access } = req.body;

        const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

        const share = await ShareService.sharePage(pageId, userId, access)
        res.json(share);
    }
    catch(error) {
        res.status(500).json({ error: "Failed to share the page" });
    }
}

export const getSharedUsers = async (req: Request, res: Response) => {
    try {
      const { pageId: rawPageId } = req.params;

      const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

      const users = await ShareService.getSharedUsers(pageId);

      res.json(users);
    } catch (error) {
      res.status(500).json({
        error:
          "Failed to get shared users",
      });
    }
}

export const revokeAccess = async (req: Request, res: Response) => {
    try {
        const { pageId: rawPageId } = req.params;
        const { userId } = req.body;
        const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

        await ShareService.removeShare(pageId, userId);

        res.json({ success: true });
    }
    catch(error) {
        res.status(500).json({ error: "Failed to revoke access" });
    }
};

export const createShareLink = async (req: Request, res: Response) => {
    try {
        // why do i have to store like this? why cant i just do req.params.pageId?
        const { pageId: rawPageId } = req.params;
        const { access } = req.body;
        const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

        const link = await ShareLinkService.createShareLink(pageId, access);

        res.status(201).json({
            id: link.id,
            token: link.token,
            access: link.access,
            expiresAt: link.expiresAt,
            url: `${process.env.FRONTEND_URL}/share/${link.token}`,
        });
    }
    catch(error) {
        res.status(500).json({ error: "Failed to create share link" });
    }
}

export const getSharePageByToken = async (req: Request, res: Response) => {
    try {
        const { token : rawToken } = req.params;
        const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
        const link = await ShareLinkService.getSharePageByToken(token);
        
        res.status(200).json({
            page: link.page,
            access: link.access
        });
    }
    catch(error) {
        res.status(404).json({ error: "Invalid share link token"});
    }
}

export const getPageLinks = async (req: Request, res: Response) => {
    try {
        const { pageId: rawPageId } = req.params;
        const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;
        const links = await ShareLinkService.getPageLinks(pageId);
        res.status(200).json(links);
    }
    catch(error) {
        res.status(500).json({ error: "Failed to get share links" });
    }
}

export const updateSharedData = async (req: Request, res: Response) => {
    try {
        const { token: rawToken } = req.params;
        const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
        const { title, content } = req.body;
        const link = await ShareLinkService.getSharePageByToken(token);
        if (link.access !== "EDIT") {
            return res.status(403).json({ error: "You don't have permission to edit this page" });
        }
        const page = await ShareLinkService.updateSharedPage(link.page.id, { title, content });
        res.status(200).json({ page });
    }
    catch(error) {
        res.status(500).json({ error: "Failed to update shared content" });
    }
}

export const deleteShareLink = async (req: Request, res: Response) => {
    try {
        const { id: rawId } = req.params;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        await ShareLinkService.deleteShareLink(id);
        res.status(200).json({ success: true });
    }
    catch(error) {
        res.status(500).json({ error: "Failed to delete share link" });
    }
}
