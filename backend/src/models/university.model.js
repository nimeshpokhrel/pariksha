import mongoose, { Schema } from "mongoose";

const universitySchema = new Schema({
  link: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  logo: { type: String, required: true },
  coverImage: { type: String, required: true },
  websiteLink: { type: String, required: true },
  establishments: { type: String, required: true },
  location: { type: String, required: true },
  foundedYear: { type: String, required: true },
  students: { type: String, required: true },
  ownership: {
    type: String,
    enum: [
      "Public",
      "Private",
      "Government",
      "Semi-Government",
      "Foreign",
      "Domestic",
    ],
    required: true,
  },
  faqs: {
    type: [{ question: String, answer: String }],
    required: false,
    default: [],
  },
});

export const University = mongoose.model("University", universitySchema);
