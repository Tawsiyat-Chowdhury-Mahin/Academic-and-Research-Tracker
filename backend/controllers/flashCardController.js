import FlashCard from "../models/FlashCard.js";


// @desc Get all flash cards
// @route GET /api/flash-cards
export const getFlashCards = async (req, res) => {
  try {
    const cards = await FlashCard.find()
      .populate("createdBy", "name email");

    res.status(200).json(cards);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// @desc Get single flash card
// @route GET /api/flash-cards/:id
export const getFlashCardById = async (req, res) => {
  try {
    const card = await FlashCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        message: "Flash card not found",
      });
    }

    res.status(200).json(card);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// @desc Create flash card
// @route POST /api/flash-cards
export const createFlashCard = async (req, res) => {
  try {
    const card = await FlashCard.create(req.body);

    res.status(201).json(card);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



// @desc Update flash card
// @route PUT /api/flash-cards/:id
export const updateFlashCard = async (req, res) => {
  try {
    const card = await FlashCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!card) {
      return res.status(404).json({
        message: "Flash card not found",
      });
    }

    res.status(200).json(card);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



// @desc Delete flash card
// @route DELETE /api/flash-cards/:id
export const deleteFlashCard = async (req, res) => {
  try {
    const card = await FlashCard.findByIdAndDelete(
      req.params.id
    );

    if (!card) {
      return res.status(404).json({
        message: "Flash card not found",
      });
    }

    res.status(200).json({
      message: "Flash card deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};