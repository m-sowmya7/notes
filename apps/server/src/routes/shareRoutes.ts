import { Router } from 'express';
import { createShareLink, getSharePageByToken, getPageLinks, updateSharedData, deleteShareLink, createLiveSession, getLiveSession, getLiveSessionStatus, endLiveSession } from '../controllers/shareController';

const router = Router();

router.post('/:pageId', createShareLink);
router.get('/token/:token', getSharePageByToken);
router.put('/token/:token', updateSharedData);
router.get('/page/:pageId', getPageLinks);
router.delete('/:id', deleteShareLink);
router.post('/live/:pageId/start', createLiveSession);
router.get('/live/invite/:inviteToken', getLiveSession);
router.get('/live/page/:pageId', getLiveSessionStatus);
router.patch('/live/:sessionId/end', endLiveSession);

export default router;
