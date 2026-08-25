import express from 'express';
import {
  getCVAnalyses,
  analyzeCV,
  deleteAnalysis,
  getAnalysisById,
} from '../controllers/cvAnalyzerController.js';

const router = express.Router();

router.route('/')
  .get(getCVAnalyses)
  .post(analyzeCV);

router.route('/:id')
  .get(getAnalysisById)
  .delete(deleteAnalysis);

export default router;
