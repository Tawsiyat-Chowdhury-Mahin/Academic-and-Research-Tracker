import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
  seedJobs,
} from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(createJob);

router.post('/seed', seedJobs);

router.route('/:id')
  .get(getJobById)
  .delete(deleteJob);

export default router;
