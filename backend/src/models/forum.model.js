import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    editedAt: { type: Date },
    image: {}
  },
  { _id: true, timestamps: true }
);

commentSchema.add({
  replies: [commentSchema],
});

const forumSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discussions: [commentSchema],
  },
  { timestamps: true }
);

export const Forum = mongoose.model("Forum", forumSchema);
