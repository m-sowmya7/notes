import { Router } from 'express';
import { createShareLink, getSharePageByToken, getPageLinks, deleteShareLink } from '../controllers/shareController';

const router = Router();

router.post('/:pageId', createShareLink);
router.get('/token/:token', getSharePageByToken);
router.get('/page/:pageId', getPageLinks);
router.delete('/:id', deleteShareLink);

export default router;
