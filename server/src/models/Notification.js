const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["announcement", "assignment", "grade"], required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseCode: { type: String, default: "" },
    courseName: { type: String, default: "" },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema)
