const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/Users");
const UserAssignment = require("../models/UserAssignments");

const router = express.Router();

function requireUserId(req, res) {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.sub;
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
}

// GET /api/courses
router.get("/courses", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const user = await User.findById(userId).populate("courses");
  res.json({ courses: user?.courses || [] });
});

// GET /api/assignments
router.get("/assignments", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const items = await UserAssignment.find({ user: userId })
    .populate("course")
    .populate("assignment");

  // sort in JS because populated fields aren't sortable in the DB query
  items.sort((a, b) => {
    const da = a.assignment?.dueDate ? new Date(a.assignment.dueDate).getTime() : 0;
    const db = b.assignment?.dueDate ? new Date(b.assignment.dueDate).getTime() : 0;
    return da - db;
  });

  const assignments = items.map((ua) => ({
    id: ua._id,
    status: ua.status,
    course: {
      id: ua.course?._id,
      code: ua.course?.code,
      title: ua.course?.title,
      color: ua.course?.color,
    },
    title: ua.assignment?.title,
    type: ua.assignment?.type,
    dueDate: ua.assignment?.dueDate,
  }));

  res.json({ assignments });
});

router.get("/debug/counts", async (req, res) => {
  const Course = require("../models/Courses");
  const Assignment = require("../models/Assignments");
  const UserAssignment = require("../models/UserAssignments");

  res.json({
    courses: await Course.countDocuments(),
    assignments: await Assignment.countDocuments(),
    userAssignments: await UserAssignment.countDocuments(),
  });
});


module.exports = router;
