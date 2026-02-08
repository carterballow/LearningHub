const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    term: { type: String, default: "Winter 2026" },
    color: { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
