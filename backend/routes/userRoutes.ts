import express, { Router } from 'express';
const router: Router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  addAddress,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/addAddress', protect, addAddress);

export default router;
