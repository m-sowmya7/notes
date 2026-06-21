import { Router } from 'express';
import { sharePage, getSharedUsers, revokeAccess } from '../controllers/shareController';

const router = Router();

router.post('/:pageId', sharePage);
router.get('/:pageId/users', getSharedUsers);
router.delete('/:pageId/users/:userId', revokeAccess);

export default router;