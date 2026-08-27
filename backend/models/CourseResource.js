import mongoose from "mongoose";

const courseResourceSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["Lecture Note", "Book", "Video", "Link", "Other"],
      default: "Other",
    },

    resourceUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CourseResource = mongoose.model(
  "CourseResource",
  courseResourceSchema
);

export default CourseResource;