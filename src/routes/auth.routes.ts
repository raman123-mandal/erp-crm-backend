import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, signupSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(signupSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

export default router;