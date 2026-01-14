import {Router} from 'express'
import { loginUser, logout, registerUser, returnMe } from '../controllers/authController.js';
import { authGuard } from '../middleware/authMiddleware.js';


const router = Router();

router.route('/login').post(loginUser);
router.route('/signup').post(registerUser);
router.route('/logout').post(logout);

router.route('/me').get(authGuard , returnMe);


export default router;