const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // Stable key used to upsert without losing _id when titles change
    seedKey: { type: String },

    title: { type: String, required: true, trim: true },

    description: { type: String, default: "" },

    type: {
      type: String,
      enum: ["homework", "quiz", "project", "reading", "exam"],
      default: "homework",
    },

    dueDate: { type: Date, required: true },

    // Max possible score (used to show grades as percentages)
    maxScore: { type: Number, default: 100 },

    // Optional PDF attachment posted by the teacher
    attachmentUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Unique by course + seedKey so we can reseed cleanly
assignmentSchema.index({ course: 1, seedKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
