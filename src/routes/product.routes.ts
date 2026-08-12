import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema } from '../validators/product.validator';

const router = Router();
router.use(authenticate);

router.post('/', authorize('ADMIN', 'WAREHOUSE'), validate(createProductSchema), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authorize('ADMIN', 'WAREHOUSE'), updateProduct);
router.delete('/:id', authorize('ADMIN'), deleteProduct);

export default router;