const mongoose = require("mongoose");

const userAssignmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // points to the template in Assignments.js
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    score: { type: Number },
  },
  { timestamps: true }
);

userAssignmentSchema.index({ user: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model("UserAssignment", userAssignmentSchema);
