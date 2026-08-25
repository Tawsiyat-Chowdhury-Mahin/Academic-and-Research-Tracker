import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Internship', 'Full-time', 'Part-time', 'Contract'], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
