import express from "express";

import {
  getPolls,
  getPollById,
  createPoll,
  votePoll,
  updatePoll,
  deletePoll,
} from "../controllers/pollController.js";


const router = express.Router();



router.get("/", getPolls);

router.get("/:id", getPollById);

router.post("/", createPoll);

router.put("/:id", updatePoll);

router.put("/:id/vote", votePoll);

router.delete("/:id", deletePoll);



export default router;