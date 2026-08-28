import mongoose from "mongoose";


const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },


    options: [
      {
        text: {
          type: String,
          required: true,
        },

        votes: {
          type: Number,
          default: 0,
        },
      },
    ],



    // Store who voted and which option they selected
    voters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        optionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],



    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  {
    timestamps: true,
  }
);



const Poll = mongoose.model(
  "Poll",
  pollSchema
);


export default Poll;