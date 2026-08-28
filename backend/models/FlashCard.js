import mongoose from "mongoose";

const flashCardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const FlashCard = mongoose.model(
  "FlashCard",
  flashCardSchema
);

export default FlashCard;