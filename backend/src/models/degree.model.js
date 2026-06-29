import mongoose, { Schema } from "mongoose";

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: false },
  title: { type: String, required: false },
  marks: { type: Number, required: false },
});

const SemesterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjects: { type: [SubjectSchema], required: false },
  electives: { type: [String], required: false },
});

const degreeSchema = new Schema({
  link: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: false },
  duration: { type: Number, required: true },
  semesterCount: { type: Number, required: true },
  university: {
    type: Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
  sector: { type: Schema.Types.ObjectId, ref: "Sector", required: true },
  coverImage: { type: String, required: true },
  description: { type: String, required: true },
  entranceCourse: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  eligibilityCriteria: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  gradingTextUp: { type: String },
  gradingSystem: {
    type: [
      {
        letter: { type: String, required: true },
        scale: { type: String, required: true },
        point: { type: String, required: true },
      },
    ],
  },
  gradingTextDown: { type: String },
  courseStructure: { type: [SemesterSchema], required: false },
  priority: { type: Number, required: false, default: 20 },
  faqs: {
    type: [{ question: String, answer: String }],
    required: false,
    default: [],
  },
});

degreeSchema.pre("save", function (next) {
  if (this.link) {
    this.link = this.link.trim().toLowerCase();
  }
  next();
});

degreeSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.link) {
    update.link = update.link.trim().toLowerCase();
    this.setUpdate(update);
  }
  next();
});

export const Degree = mongoose.model("Degree", degreeSchema);
