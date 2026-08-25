import express from 'express';
import { register, login, getMe, seedAuth } from '../controllers/authController.js';

const router = express.Router();

// Routes for user registration and authentication
router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.post('/seed', seedAuth);

export default router;
