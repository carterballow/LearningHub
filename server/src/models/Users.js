const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },

    // "student" or "teacher"
    role: { type: String, enum: ["student", "teacher"], default: "student" },

    // Profile extras
    bio: { type: String, default: "", trim: true },
    avatarUrl: { type: String, default: "", trim: true },

    // Preferences
    emailNotifications: { type: Boolean, default: false },
    themeColor: { type: String, default: "teal" }, // teal | blue | purple | rose | green
    highContrast: { type: Boolean, default: false },

    // Account management
    deletionRequested: { type: Boolean, default: false },

    // Courses the user is enrolled in (students) or teaching (teachers)
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
