const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    term: { type: String, default: "Spring 2026" },
    color: { type: String, default: "#6366f1" },

    // Instructor info shown on course page
    instructor: { type: String, default: "TBD" },
    instructorEmail: { type: String, default: "" },
    schedule: { type: String, default: "TBD" },
    location: { type: String, default: "TBD" },

    // Used by the AI tutor as course context
    description: { type: String, default: "" },

    // Teacher-uploaded syllabus URL (Google Drive, course site, etc.)
    syllabusUrl: { type: String, default: "" },

    // Grading weights: { homework: 30, quiz: 20, exam: 50 } — must sum to 100
    gradingScheme: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
