import mongoose from 'mongoose';

const alumniSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    degree: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    skills: [{ type: String }],
    email: { type: String, required: true },
    linkedin: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

const Alumni = mongoose.model('Alumni', alumniSchema);

export default Alumni;
