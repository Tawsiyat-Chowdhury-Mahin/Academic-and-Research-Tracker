import express from 'express';
import { getCoursePlans, saveCoursePlan } from '../controllers/coursePlanController.js';

const router = express.Router();

router.get('/', getCoursePlans);
router.post('/', saveCoursePlan);

export default router;
