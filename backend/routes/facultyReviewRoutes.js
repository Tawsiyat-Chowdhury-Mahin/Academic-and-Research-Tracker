import express from 'express';
import { getFacultyReviews, createFacultyReview } from '../controllers/facultyReviewController.js';

const router = express.Router();

router.get('/', getFacultyReviews);
router.post('/', createFacultyReview);

export default router;
