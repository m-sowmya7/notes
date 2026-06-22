import { Router } from 'express';
import { createShareLink, getSharePageByToken, getPageLinks, updateSharedData, deleteShareLink } from '../controllers/shareController';

const router = Router();

router.post('/:pageId', createShareLink);
router.get('/token/:token', getSharePageByToken);
router.put('/token/:token', updateSharedData);
router.get('/page/:pageId', getPageLinks);
router.delete('/:id', deleteShareLink);

export default router;
