import mongoose, { Schema } from "mongoose";

const collegeSchema = new Schema({
  link: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  university: {
    type: Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
  degrees: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Degree",
        required: true,
      },
    ],
    required: true,
  },
  coverImage: { type: String, required: true },
  location: { type: String, required: true },
  facebookLink: { type: String, required: false },
  instagramLink: { type: String, required: false },
  websiteLink: { type: String, required: false },
  emailLink: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  foundedYear: { type: String, required: true },
  salientFeatures: { type: Array, required: false },
  gallery: { type: [String], required: false, default: [] },
  faqs: {
    type: [{ question: String, answer: String }],
    required: false,
    default: [],
  },
  priority: { type: Number, required: false, default: 20 },
});

collegeSchema.pre("save", function (next) {
  if (this.link) {
    this.link = this.link.trim().toLowerCase();
  }
  next();
});

collegeSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.link) {
    update.link = update.link.trim().toLowerCase();
    this.setUpdate(update);
  }
  next();
});

export const College = mongoose.model("College", collegeSchema);
