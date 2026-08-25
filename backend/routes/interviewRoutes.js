import express from 'express';
import {
  getQuestions,
  submitInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
} from '../controllers/interviewController.js';

const router = express.Router();

router.route('/')
  .get(getInterviews);

router.post('/questions', getQuestions);
router.post('/submit', submitInterview);

router.route('/:id')
  .get(getInterviewById)
  .delete(deleteInterview);

export default router;
