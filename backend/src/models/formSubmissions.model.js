import mongoose, { Schema } from "mongoose";
import { type } from "os";

const formSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: Number, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    status: {
      type: String,
      enum: ["unhandled", "positive", "negative"],
      default: "unhandled",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const FormSubmission = mongoose.model(
  "FormSubmission",
  formSubmissionSchema
);
