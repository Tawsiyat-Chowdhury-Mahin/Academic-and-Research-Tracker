import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: [{ type: String }],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String },
      }
    ],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
