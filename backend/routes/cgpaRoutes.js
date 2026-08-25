import express from 'express';
import { getCgpaRecords, saveCgpaRecord } from '../controllers/cgpaController.js';

const router = express.Router();

router.get('/', getCgpaRecords);
router.post('/', saveCgpaRecord);

export default router;
