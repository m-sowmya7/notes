import { Router } from 'express';
import { createPage, getPages, getPageById, updatePage } from '../controllers/documentController';

const router = Router();

router.post('/', createPage);
router.get('/', getPages);
router.get('/:id', getPageById);
router.put('/:id', updatePage);

export default router;