import { Router } from 'express';
import { getBalance } from '../controllers/account.controller';
import { protect } from '../middlewares/authorization.middleware';

const router = Router();

router.route('/balance').get(protect, getBalance);

export default router;
