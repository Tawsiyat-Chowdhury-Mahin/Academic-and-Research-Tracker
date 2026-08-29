import express from "express";

import {
  getFlashCards,
  getFlashCardById,
  createFlashCard,
  updateFlashCard,
  deleteFlashCard,
} from "../controllers/flashCardController.js";


const router = express.Router();


router.get("/", getFlashCards);

router.get("/:id", getFlashCardById);

router.post("/", createFlashCard);

router.put("/:id", updateFlashCard);

router.delete("/:id", deleteFlashCard);


export default router;