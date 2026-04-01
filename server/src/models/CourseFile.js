const mongoose = require("mongoose")

const courseFileSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploaderName: { type: String, default: "" },
  },
  { timestamps: true }
)

module.exports = mongoose.model("CourseFile", courseFileSchema)
