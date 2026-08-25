import express from 'express';
import {
  getStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan
} from '../controllers/studyPlanController.js';

const router = express.Router();

router.get('/', getStudyPlans);
router.post('/', createStudyPlan);
router.put('/:id', updateStudyPlan);
router.delete('/:id', deleteStudyPlan);

export default router;