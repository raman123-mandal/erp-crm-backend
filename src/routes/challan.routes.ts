import { Router } from 'express';
import { createChallan, getChallans, getChallanById, confirmChallan, cancelChallan } from '../controllers/challan.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createChallanSchema } from '../validators/challan.validator';

const router = Router();
router.use(authenticate);

router.post('/', authorize('ADMIN', 'SALES'), validate(createChallanSchema), createChallan);
router.get('/', getChallans);
router.get('/:id', getChallanById);
router.post('/:id/confirm', authorize('ADMIN', 'WAREHOUSE', 'SALES'), confirmChallan);
router.post('/:id/cancel', authorize('ADMIN', 'SALES'), cancelChallan);

export default router;