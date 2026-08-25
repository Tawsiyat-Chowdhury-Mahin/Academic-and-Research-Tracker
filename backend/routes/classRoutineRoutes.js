import express from 'express';
import { getClassRoutines, saveClassRoutine } from '../controllers/classRoutineController.js';

const router = express.Router();

router.get('/', getClassRoutines);
router.post('/', saveClassRoutine);

export default router;
