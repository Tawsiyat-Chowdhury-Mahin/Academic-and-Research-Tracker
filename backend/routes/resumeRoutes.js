import express from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';

const router = express.Router();

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

export default router;
