const mongoose = require("mongoose");


const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    title: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["homework", "quiz", "project", "reading", "exam"],
      default: "homework",
    },

    // ✅ REQUIRED for your current seed + UI
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// prevent duplicates when you seed repeatedly
assignmentSchema.index({ course: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
