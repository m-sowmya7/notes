import { Router } from 'express';
import { createPage, getPages, getPageById, updatePage, deletePage, toggleStar, getStarredPages } from '../controllers/documentController';

const router = Router();

router.post('/', createPage);
router.get('/', getPages);
router.get('/starred', getStarredPages);
router.get('/:id', getPageById);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);
router.patch("/:id/star", toggleStar)

export default router;