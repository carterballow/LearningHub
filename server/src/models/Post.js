const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAnonymous: { type: Boolean, default: false },
    authorName: { type: String, default: "" }, // empty when anonymous
  },
  { timestamps: true }
)

module.exports = mongoose.model("Post", postSchema)
