import { Router } from 'express';
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator';

const router = Router();
router.use(authenticate);

router.post('/', authorize('ADMIN', 'SALES'), validate(createCustomerSchema), createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', authorize('ADMIN', 'SALES'), validate(updateCustomerSchema), updateCustomer);
router.delete('/:id', authorize('ADMIN'), deleteCustomer);

export default router;