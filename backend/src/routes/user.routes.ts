import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  test,
  updatePassword,
} from '../controllers/user.controller';
import { protect } from '../middlewares/authorization.middleware';

const router = Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/updatePassword').post(protect, updatePassword);

router.route('/check').get(protect, test);

export default router;
