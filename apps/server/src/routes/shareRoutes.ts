import { Router } from 'express';
import { createShareLink, getSharePageByToken, getPageLinks, updateSharedData, deleteShareLink } from '../controllers/shareController';
import { createLiveSession, getLiveSessionStatus, validateInvite, joinLiveSession, endLiveSession } from '../controllers/liveController';

const router = Router();
// Share
router.post("/:pageId", createShareLink);
router.get("/token/:token", getSharePageByToken);
router.put("/token/:token", updateSharedData);
router.get("/page/:pageId", getPageLinks);
router.delete("/:id", deleteShareLink);

// Live
router.post("/live/page/:pageId", createLiveSession);
router.get("/live/page/:pageId", getLiveSessionStatus);
router.get("/live/invite/:inviteToken", validateInvite);
router.post("/live/invite/:inviteToken/join", joinLiveSession);
router.patch("/live/session/:sessionId/end", endLiveSession);
export default router;
