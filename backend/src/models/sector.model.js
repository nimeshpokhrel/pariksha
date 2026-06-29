import mongoose, { Schema } from "mongoose";

const sectorSchema = new Schema({
  link: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  coverImage: { type: String, required: true },
  description: { type: String, required: true },
  areasOfStudy: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    required: true,
  },
  careerProspect: {
    type: [
      {
        title: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    required: true,
  },
  faqs: {
    type: [{ question: String, answer: String }],
    required: false,
    default: [],
  },
});

export const Sector = mongoose.model("Sector", sectorSchema);
