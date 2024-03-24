import { Router } from 'express';
import { getBalance, transferMoney } from '../controllers/account.controller';
import { protect } from '../middlewares/authorization.middleware';

const router = Router();

router.route('/balance').get(protect, getBalance);
router.route('/transfer').post(protect, transferMoney);

export default router;