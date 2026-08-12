import { Router } from 'express';
import { adjustStock, getStockMovements } from '../controllers/stock.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { stockAdjustmentSchema } from '../validators/product.validator';

const router = Router();
router.use(authenticate);

router.post('/products/:id/adjust', authorize('ADMIN', 'WAREHOUSE'), validate(stockAdjustmentSchema), adjustStock);
router.get('/movements', getStockMovements);

export default router;