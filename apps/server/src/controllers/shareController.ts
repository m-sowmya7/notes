import { Request, Response } from 'express';
import { ShareService } from '../services/shareService';

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