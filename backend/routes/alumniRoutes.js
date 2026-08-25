import express from 'express';
import {
  getAlumni,
  getAlumnusById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  seedAlumni,
} from '../controllers/alumniController.js';

const router = express.Router();

router.route('/')
  .get(getAlumni)
  .post(createAlumni);

router.post('/seed', seedAlumni);

router.route('/:id')
  .get(getAlumnusById)
  .put(updateAlumni)
  .delete(deleteAlumni);

export default router;
