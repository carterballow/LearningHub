const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("../models/Users");
const Course = require("../models/Courses");
const Assignment = require("../models/Assignments");
const UserAssignment = require("../models/UserAssignments");
const Announcement = require("../models/Announcement");
const Post = require("../models/Post");
const CourseFile = require("../models/CourseFile");
const Notification = require("../models/Notification");

const router = express.Router();

// ─── Multer setup ─────────────────────────────────────────────────────────────

function makeUploader(subdir, allowedMimes) {
  const dir = path.join(__dirname, "..", "..", "uploads", subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
      if (!allowedMimes || allowedMimes.includes(file.mimetype)) cb(null, true);
      else cb(new Error("File type not allowed"));
    },
  });
}

const avatarUpload = makeUploader("avatars", ["image/jpeg", "image/png", "image/gif", "image/webp"]);
const syllabusUpload = makeUploader("syllabi", ["application/pdf"]);
const assignmentFileUpload = makeUploader("assignments", ["application/pdf"]);

// ─── Email helper (logs if not configured) ────────────────────────────────────

async function sendEmail({ to, subject, text }) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.log(`📧 [Email not configured] To: ${to} | Subject: ${subject} | ${text.slice(0, 100)}`);
    return;
  }
  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({ from: user, to, subject, text });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}

// ─── Notification helper ──────────────────────────────────────────────────────

async function createNotificationsForCourse(courseId, type, title, body) {
  const course = await Course.findById(courseId);
  if (!course) return;
  const students = await User.find({ courses: courseId, role: "student" }).select("_id email emailNotifications");
  if (!students.length) return;

  const notifDocs = students.map((s) => ({
    user: s._id,
    type,
    courseId: course._id,
    courseCode: course.code,
    courseName: course.title,
    title,
    body,
  }));
  await Notification.insertMany(notifDocs);

  // Send email to opted-in students
  for (const s of students) {
    if (s.emailNotifications) {
      await sendEmail({
        to: s.email,
        subject: `[${course.code}] ${title}`,
        text: `${title}\n\n${body}\n\nCourse: ${course.title}`,
      });
    }
  }
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

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

async function requireUser(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
}

// ─── GET /api/courses ─────────────────────────────────────────────────────────
// Returns the list of courses the logged-in user is enrolled in / teaching.

router.get("/courses", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const user = await User.findById(userId).populate("courses");
  res.json({ courses: user?.courses || [], role: user?.role || "student" });
});

// ─── GET /api/courses/:id ─────────────────────────────────────────────────────
// Full course detail: course info + all assignments (with UserAssignment status/grade).

router.get("/courses/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  // Get all assignments for this course
  const assignments = await Assignment.find({ course: course._id }).sort({ dueDate: 1 });

  // Get this user's UserAssignment records for those assignments
  const userAssignments = await UserAssignment.find({
    user: user._id,
    course: course._id,
  });

  const uaMap = {};
  for (const ua of userAssignments) {
    uaMap[ua.assignment.toString()] = ua;
  }

  const assignmentList = assignments.map((a) => {
    const ua = uaMap[a._id.toString()];
    return {
      id: a._id,
      seedKey: a.seedKey,
      title: a.title,
      description: a.description,
      type: a.type,
      dueDate: a.dueDate,
      maxScore: a.maxScore,
      attachmentUrl: a.attachmentUrl || "",
      userAssignmentId: ua?._id || null,
      status: ua?.status || "todo",
      grade: ua?.grade ?? null,
      feedback: ua?.feedback || null,
      submissionText: ua?.submissionText || null,
      submissionFileUrl: ua?.submissionFileUrl || null,
      submittedAt: ua?.submittedAt || null,
    };
  });

  // If teacher: also include all student submissions for this course
  let studentSubmissions = null;
  if (user.role === "teacher" && user.courses.some((c) => c.toString() === course._id.toString())) {
    const allUAs = await UserAssignment.find({ course: course._id })
      .populate("user", "name email")
      .populate("assignment", "title type maxScore dueDate");

    studentSubmissions = allUAs
      .filter((ua) => ua.submittedAt || ua.grade != null)
      .map((ua) => ({
        userAssignmentId: ua._id,
        student: { id: ua.user?._id, name: ua.user?.name, email: ua.user?.email },
        assignmentTitle: ua.assignment?.title,
        assignmentType: ua.assignment?.type,
        maxScore: ua.assignment?.maxScore,
        dueDate: ua.assignment?.dueDate,
        status: ua.status,
        grade: ua.grade ?? null,
        feedback: ua.feedback || null,
        submissionText: ua.submissionText || null,
        submissionFileUrl: ua.submissionFileUrl || null,
        submittedAt: ua.submittedAt || null,
      }));
  }

  // Fetch announcements and files for this course
  const announcements = await Announcement.find({ course: course._id }).sort({ createdAt: -1 }).limit(20);
  const files = await CourseFile.find({ course: course._id }).sort({ createdAt: -1 });

  // Convert gradingScheme Map to plain object
  const gradingScheme = course.gradingScheme ? Object.fromEntries(course.gradingScheme) : {};

  res.json({
    course: {
      id: course._id,
      code: course.code,
      title: course.title,
      term: course.term,
      color: course.color,
      instructor: course.instructor,
      instructorEmail: course.instructorEmail,
      schedule: course.schedule,
      location: course.location,
      description: course.description,
      syllabusUrl: course.syllabusUrl || "",
      gradingScheme,
    },
    assignments: assignmentList,
    studentSubmissions,
    announcements: announcements.map((a) => ({
      id: a._id,
      title: a.title,
      body: a.body,
      authorName: a.authorName,
      createdAt: a.createdAt,
    })),
    files: files.map((f) => ({
      id: f._id,
      name: f.name,
      url: f.url,
      description: f.description,
      uploaderName: f.uploaderName,
      createdAt: f.createdAt,
    })),
    role: user.role,
  });
});

// ─── GET /api/assignments ─────────────────────────────────────────────────────
// All UserAssignments for the logged-in user, sorted by due date.

router.get("/assignments", async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const items = await UserAssignment.find({ user: userId })
    .populate("course")
    .populate("assignment");

  items.sort((a, b) => {
    const da = a.assignment?.dueDate ? new Date(a.assignment.dueDate).getTime() : 0;
    const db = b.assignment?.dueDate ? new Date(b.assignment.dueDate).getTime() : 0;
    return da - db;
  });

  const assignments = items.map((ua) => ({
    id: ua._id,
    status: ua.status,
    grade: ua.grade ?? null,
    feedback: ua.feedback || null,
    submittedAt: ua.submittedAt || null,
    course: {
      id: ua.course?._id,
      code: ua.course?.code,
      title: ua.course?.title,
      color: ua.course?.color,
    },
    title: ua.assignment?.title,
    type: ua.assignment?.type,
    dueDate: ua.assignment?.dueDate,
    maxScore: ua.assignment?.maxScore,
    description: ua.assignment?.description,
  }));

  res.json({ assignments });
});

// ─── PATCH /api/userassignments/:id/status ────────────────────────────────────
// Student updates their own assignment status (todo / in-progress / done).

router.patch("/userassignments/:id/status", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { status } = req.body;
  const allowed = ["todo", "in-progress", "done"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const ua = await UserAssignment.findOne({ _id: req.params.id, user: user._id });
  if (!ua) return res.status(404).json({ error: "Not found" });

  ua.status = status;
  await ua.save();
  res.json({ success: true, status: ua.status });
});

// ─── POST /api/userassignments/:id/submit ─────────────────────────────────────
// Student submits text for an assignment.

router.post("/userassignments/:id/submit", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { submissionText, submissionFileUrl } = req.body;
  if ((!submissionText || !submissionText.trim()) && !submissionFileUrl) {
    return res.status(400).json({ error: "Submission text or file is required" });
  }

  const ua = await UserAssignment.findOne({ _id: req.params.id, user: user._id });
  if (!ua) return res.status(404).json({ error: "Not found" });

  if (submissionText && submissionText.trim()) ua.submissionText = submissionText.trim();
  if (submissionFileUrl) ua.submissionFileUrl = submissionFileUrl;
  ua.submittedAt = new Date();
  ua.status = "done";
  await ua.save();

  res.json({ success: true, submittedAt: ua.submittedAt });
});

// ─── PATCH /api/userassignments/:id/grade ─────────────────────────────────────
// Teacher grades a student's submission.

router.patch("/userassignments/:id/grade", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  if (user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can grade assignments" });
  }

  const { grade, feedback } = req.body;
  if (grade === undefined || grade === null || isNaN(Number(grade))) {
    return res.status(400).json({ error: "Valid grade is required" });
  }

  // Find the UA — it must belong to a course this teacher teaches
  const ua = await UserAssignment.findById(req.params.id).populate("course");
  if (!ua) return res.status(404).json({ error: "Not found" });

  const teacherTeachesCourse = user.courses.some(
    (c) => c.toString() === ua.course._id.toString()
  );
  if (!teacherTeachesCourse) {
    return res.status(403).json({ error: "You do not teach this course" });
  }

  ua.grade = Number(grade);
  if (feedback !== undefined) ua.feedback = feedback;
  await ua.save();

  // Notify the student
  const assignmentDoc = await Assignment.findById(ua.assignment);
  if (assignmentDoc) {
    const pct = Math.round((ua.grade / assignmentDoc.maxScore) * 100);
    await Notification.create({
      user: ua.user,
      type: "grade",
      courseId: ua.course,
      title: `Grade posted: ${assignmentDoc.title}`,
      body: `You received ${ua.grade}/${assignmentDoc.maxScore} (${pct}%)${ua.feedback ? " · " + ua.feedback.slice(0, 80) : ""}`,
    });
  }

  res.json({ success: true, grade: ua.grade, feedback: ua.feedback });
});

// ─── PATCH /api/profile ───────────────────────────────────────────────────────
// Update display name.

router.patch("/profile", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { name, bio, avatarUrl } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });

  user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();
  await user.save();
  res.json({ success: true, name: user.name, bio: user.bio, avatarUrl: user.avatarUrl });
});

// ─── GET /api/grades/summary ──────────────────────────────────────────────────
// Returns graded assignments grouped by course, with averages.

router.get("/grades/summary", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const gradedUAs = await UserAssignment.find({ user: user._id, grade: { $ne: null } })
    .populate("assignment", "title type maxScore")
    .populate("course", "code title color");

  const byCourse = {};
  for (const ua of gradedUAs) {
    if (!ua.assignment || !ua.course) continue;
    const cid = ua.course._id.toString();
    if (!byCourse[cid]) {
      byCourse[cid] = { code: ua.course.code, title: ua.course.title, color: ua.course.color, grades: [] };
    }
    byCourse[cid].grades.push({
      title: ua.assignment.title,
      type: ua.assignment.type,
      grade: ua.grade,
      maxScore: ua.assignment.maxScore,
      pct: Math.round((ua.grade / ua.assignment.maxScore) * 100),
    });
  }

  const courses = Object.values(byCourse).map((c) => {
    const avg = c.grades.length ? Math.round(c.grades.reduce((s, g) => s + g.pct, 0) / c.grades.length) : null;
    return { ...c, avg };
  });

  const overall = courses.length && courses.some((c) => c.avg !== null)
    ? Math.round(courses.filter((c) => c.avg !== null).reduce((s, c) => s + c.avg, 0) / courses.filter((c) => c.avg !== null).length)
    : null;

  res.json({ courses, overall });
});

// ─── GET /api/announcements ───────────────────────────────────────────────────
// Returns upcoming exams + recent graded assignments as "announcements".

router.get("/announcements", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const today = new Date();

  // Upcoming exams in the next 30 days
  const upcomingExamUAs = await UserAssignment.find({ user: user._id })
    .populate({ path: "assignment", match: { type: "exam", dueDate: { $gte: today } } })
    .populate("course", "code title");

  const examAnnouncements = upcomingExamUAs
    .filter((ua) => ua.assignment)
    .sort((a, b) => new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate))
    .slice(0, 3)
    .map((ua) => {
      const days = Math.ceil((new Date(ua.assignment.dueDate) - today) / (1000 * 60 * 60 * 24));
      return {
        title: `${ua.course?.code} ${ua.assignment.title}`,
        description: days <= 7
          ? `⚠️ Only ${days} day${days === 1 ? "" : "s"} away — make sure you're prepared!`
          : `Coming up in ${days} days. ${ua.assignment.description?.slice(0, 80) || ""}`,
        time: days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`,
        type: "exam",
      };
    });

  // Recently graded assignments
  const recentlyGraded = await UserAssignment.find({ user: user._id, grade: { $ne: null } })
    .sort({ updatedAt: -1 })
    .limit(2)
    .populate("assignment", "title maxScore")
    .populate("course", "code");

  const gradeAnnouncements = recentlyGraded.map((ua) => {
    const pct = Math.round((ua.grade / ua.assignment.maxScore) * 100);
    return {
      title: `Grade posted: ${ua.course?.code} ${ua.assignment?.title}`,
      description: `You received ${ua.grade}/${ua.assignment.maxScore} (${pct}%).${ua.feedback ? " Feedback: " + ua.feedback.slice(0, 60) : ""}`,
      time: "Recently",
      type: "grade",
    };
  });

  res.json({ announcements: [...gradeAnnouncements, ...examAnnouncements] });
});

// ─── POST /api/courses/:id/assignments ────────────────────────────────────────
// Teacher creates a new assignment for this course.

router.post("/courses/:id/assignments", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const teacherTeaches = user.courses.some((c) => c.toString() === course._id.toString());
  if (!teacherTeaches) return res.status(403).json({ error: "You do not teach this course" });

  const { title, description, type, dueDate, maxScore, attachmentUrl } = req.body;
  if (!title || !type || !dueDate || !maxScore) {
    return res.status(400).json({ error: "title, type, dueDate, and maxScore are required" });
  }

  const assignment = await Assignment.create({
    course: course._id,
    title: title.trim(),
    description: (description || "").trim(),
    type,
    dueDate: new Date(dueDate),
    maxScore: Number(maxScore),
    attachmentUrl: attachmentUrl || "",
  });

  // Create UserAssignment for all enrolled students
  const students = await User.find({ courses: course._id, role: "student" }).select("_id");
  if (students.length > 0) {
    const uaOps = students.map((s) => ({
      updateOne: {
        filter: { user: s._id, assignment: assignment._id },
        update: { $setOnInsert: { user: s._id, course: course._id, assignment: assignment._id, status: "todo" } },
        upsert: true,
      },
    }));
    await UserAssignment.bulkWrite(uaOps, { ordered: false });
  }

  // Notify enrolled students
  const dueStr = new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  await createNotificationsForCourse(
    course._id,
    "assignment",
    `New ${assignment.type}: ${assignment.title}`,
    `Due ${dueStr} · ${assignment.maxScore} points`
  );

  res.status(201).json({
    id: assignment._id,
    title: assignment.title,
    description: assignment.description,
    type: assignment.type,
    dueDate: assignment.dueDate,
    maxScore: assignment.maxScore,
    attachmentUrl: assignment.attachmentUrl,
  });
});

// ─── DELETE /api/assignments/:id ──────────────────────────────────────────────
// Teacher deletes an assignment.

router.delete("/assignments/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Not found" });

  const teacherTeaches = user.courses.some((c) => c.toString() === assignment.course.toString());
  if (!teacherTeaches) return res.status(403).json({ error: "You do not teach this course" });

  await UserAssignment.deleteMany({ assignment: assignment._id });
  await assignment.deleteOne();

  res.json({ success: true });
});

// ─── PATCH /api/courses/:id/syllabus ──────────────────────────────────────────
// Teacher sets or updates the syllabus URL.

router.patch("/courses/:id/syllabus", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const teacherTeaches = user.courses.some((c) => c.toString() === course._id.toString());
  if (!teacherTeaches) return res.status(403).json({ error: "You do not teach this course" });

  course.syllabusUrl = (req.body.syllabusUrl || "").trim();
  await course.save();
  res.json({ success: true, syllabusUrl: course.syllabusUrl });
});

// ─── PATCH /api/courses/:id/grading-scheme ────────────────────────────────────
// Teacher sets grading weights. Weights should be a plain object like { homework: 30, exam: 70 }.

router.patch("/courses/:id/grading-scheme", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const teacherTeaches = user.courses.some((c) => c.toString() === course._id.toString());
  if (!teacherTeaches) return res.status(403).json({ error: "You do not teach this course" });

  const { scheme } = req.body; // e.g. { homework: 30, quiz: 20, exam: 50 }
  if (!scheme || typeof scheme !== "object") {
    return res.status(400).json({ error: "scheme must be an object" });
  }

  course.gradingScheme = scheme;
  await course.save();
  res.json({ success: true, gradingScheme: Object.fromEntries(course.gradingScheme) });
});

// ─── GET /api/courses/:id/announcements ───────────────────────────────────────

router.get("/courses/:id/announcements", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const announcements = await Announcement.find({ course: req.params.id }).sort({ createdAt: -1 });
  res.json({ announcements: announcements.map((a) => ({
    id: a._id,
    title: a.title,
    body: a.body,
    authorName: a.authorName,
    createdAt: a.createdAt,
  })) });
});

// ─── POST /api/courses/:id/announcements ──────────────────────────────────────

router.post("/courses/:id/announcements", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: "title and body are required" });

  const ann = await Announcement.create({
    course: req.params.id,
    title: title.trim(),
    body: body.trim(),
    author: user._id,
    authorName: user.name,
  });

  // Notify enrolled students
  await createNotificationsForCourse(req.params.id, "announcement", ann.title, ann.body);

  res.status(201).json({
    id: ann._id,
    title: ann.title,
    body: ann.body,
    authorName: ann.authorName,
    createdAt: ann.createdAt,
  });
});

// ─── DELETE /api/announcements/:id ────────────────────────────────────────────

router.delete("/announcements/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const ann = await Announcement.findById(req.params.id);
  if (!ann) return res.status(404).json({ error: "Not found" });
  if (ann.author.toString() !== user._id.toString()) return res.status(403).json({ error: "Not your announcement" });

  await ann.deleteOne();
  res.json({ success: true });
});

// ─── GET /api/courses/:id/posts ───────────────────────────────────────────────

router.get("/courses/:id/posts", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const posts = await Post.find({ course: req.params.id }).sort({ createdAt: -1 }).limit(50);
  res.json({
    posts: posts.map((p) => ({
      id: p._id,
      content: p.content,
      isAnonymous: p.isAnonymous,
      authorName: p.isAnonymous ? "Anonymous" : p.authorName,
      isOwn: p.author.toString() === user._id.toString(),
      createdAt: p.createdAt,
    })),
  });
});

// ─── POST /api/courses/:id/posts ──────────────────────────────────────────────

router.post("/courses/:id/posts", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { content, isAnonymous } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: "content is required" });

  const post = await Post.create({
    course: req.params.id,
    content: content.trim(),
    author: user._id,
    isAnonymous: !!isAnonymous,
    authorName: isAnonymous ? "" : user.name,
  });

  res.status(201).json({
    id: post._id,
    content: post.content,
    isAnonymous: post.isAnonymous,
    authorName: post.isAnonymous ? "Anonymous" : post.authorName,
    isOwn: true,
    createdAt: post.createdAt,
  });
});

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────

router.delete("/posts/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  if (post.author.toString() !== user._id.toString() && user.role !== "teacher") {
    return res.status(403).json({ error: "Not allowed" });
  }

  await post.deleteOne();
  res.json({ success: true });
});

// ─── GET /api/courses/:id/files ───────────────────────────────────────────────

router.get("/courses/:id/files", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const files = await CourseFile.find({ course: req.params.id }).sort({ createdAt: -1 });
  res.json({
    files: files.map((f) => ({
      id: f._id,
      name: f.name,
      url: f.url,
      description: f.description,
      uploaderName: f.uploaderName,
      createdAt: f.createdAt,
    })),
  });
});

// ─── POST /api/courses/:id/files ──────────────────────────────────────────────

router.post("/courses/:id/files", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const { name, url, description } = req.body;
  if (!name || !url) return res.status(400).json({ error: "name and url are required" });

  const file = await CourseFile.create({
    course: req.params.id,
    name: name.trim(),
    url: url.trim(),
    description: (description || "").trim(),
    uploadedBy: user._id,
    uploaderName: user.name,
  });

  res.status(201).json({
    id: file._id,
    name: file.name,
    url: file.url,
    description: file.description,
    uploaderName: file.uploaderName,
    createdAt: file.createdAt,
  });
});

// ─── DELETE /api/files/:id ────────────────────────────────────────────────────

router.delete("/files/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });

  const file = await CourseFile.findById(req.params.id);
  if (!file) return res.status(404).json({ error: "Not found" });
  if (file.uploadedBy.toString() !== user._id.toString()) return res.status(403).json({ error: "Not your file" });

  await file.deleteOne();
  res.json({ success: true });
});

// ─── GET /api/debug/counts ────────────────────────────────────────────────────

router.get("/debug/counts", async (req, res) => {
  res.json({
    courses: await Course.countDocuments(),
    assignments: await Assignment.countDocuments(),
    userAssignments: await UserAssignment.countDocuments(),
    users: await User.countDocuments(),
  });
});

// ─── POST /api/upload/avatar ──────────────────────────────────────────────────

router.post("/upload/avatar", avatarUpload.single("avatar"), async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Delete old avatar file if local
  if (user.avatarUrl && user.avatarUrl.startsWith("/uploads/")) {
    const oldPath = path.join(__dirname, "..", "..", user.avatarUrl);
    fs.unlink(oldPath, () => {});
  }

  const url = `/uploads/avatars/${req.file.filename}`;
  user.avatarUrl = url;
  await user.save();
  res.json({ url });
});

// ─── POST /api/upload/syllabus/:courseId ──────────────────────────────────────

router.post("/upload/syllabus/:courseId", syllabusUpload.single("syllabus"), async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const teacherTeaches = user.courses.some((c) => c.toString() === course._id.toString());
  if (!teacherTeaches) return res.status(403).json({ error: "You do not teach this course" });

  // Delete old syllabus if local
  if (course.syllabusUrl && course.syllabusUrl.startsWith("/uploads/")) {
    const oldPath = path.join(__dirname, "..", "..", course.syllabusUrl);
    fs.unlink(oldPath, () => {});
  }

  const url = `/uploads/syllabi/${req.file.filename}`;
  course.syllabusUrl = url;
  await course.save();
  res.json({ url });
});

// ─── POST /api/upload/assignment-file ─────────────────────────────────────────
// Teacher uploads a PDF to attach to an assignment description

router.post("/upload/assignment-file", assignmentFileUpload.single("file"), async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Teachers only" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const url = `/uploads/assignments/${req.file.filename}`;
  res.json({ url, name: req.file.originalname });
});

// ─── POST /api/upload/submission-file ────────────────────────────────────────
// Student uploads a PDF submission

router.post("/upload/submission-file", assignmentFileUpload.single("file"), async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const url = `/uploads/assignments/${req.file.filename}`;
  res.json({ url, name: req.file.originalname });
});

// ─── GET /api/notifications ───────────────────────────────────────────────────

router.get("/notifications", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const notifs = await Notification.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    notifications: notifs.map((n) => ({
      id: n._id,
      type: n.type,
      courseCode: n.courseCode,
      courseName: n.courseName,
      title: n.title,
      body: n.body,
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount: notifs.filter((n) => !n.read).length,
  });
});

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────

router.patch("/notifications/read-all", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  await Notification.updateMany({ user: user._id, read: false }, { $set: { read: true } });
  res.json({ success: true });
});

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────

router.patch("/notifications/:id/read", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  await Notification.updateOne({ _id: req.params.id, user: user._id }, { $set: { read: true } });
  res.json({ success: true });
});

// ─── GET /api/search ──────────────────────────────────────────────────────────

router.get("/search", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) return res.json({ courses: [], assignments: [], people: [] });

  const regex = new RegExp(q, "i");

  // Search in user's enrolled/teaching courses
  const userCourses = await Course.find({ _id: { $in: user.courses }, $or: [{ title: regex }, { code: regex }, { instructor: regex }] });

  // Search assignments in those courses
  const assignments = await Assignment.find({
    course: { $in: user.courses },
    title: regex,
  }).populate("course", "code title").limit(10);

  // Search people (teachers in same courses, or students if teacher)
  const people = await User.find({
    courses: { $in: user.courses },
    $or: [{ name: regex }, { email: regex }],
    _id: { $ne: user._id },
  }).select("name email role").limit(10);

  res.json({
    courses: userCourses.map((c) => ({ id: c._id, code: c.code, title: c.title, instructor: c.instructor })),
    assignments: assignments.map((a) => ({
      id: a._id,
      title: a.title,
      type: a.type,
      dueDate: a.dueDate,
      courseCode: a.course?.code,
      courseId: a.course?._id,
    })),
    people: people.map((p) => ({ id: p._id, name: p.name, email: p.email, role: p.role })),
  });
});

// ─── PATCH /api/preferences ───────────────────────────────────────────────────
// Save theme + notification preferences to DB

router.patch("/preferences", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { themeColor, highContrast, emailNotifications } = req.body;
  if (themeColor !== undefined) user.themeColor = themeColor;
  if (highContrast !== undefined) user.highContrast = highContrast;
  if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
  await user.save();
  res.json({ success: true });
});

// ─── POST /api/account/request-deletion ──────────────────────────────────────

router.post("/account/request-deletion", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  user.deletionRequested = true;
  await user.save();

  // "Email" admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL || "admin@learninghub.app",
    subject: `Account deletion request: ${user.email}`,
    text: `User ${user.name} (${user.email}, ID: ${user._id}) has requested account deletion.\n\nTo approve, delete the user from the database.`,
  });

  res.json({ success: true });
});

// ─── GET /api/students ────────────────────────────────────────────────────────
// Returns all students enrolled in the teacher's courses.

router.get("/students", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  if (user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });

  const students = await User.find({
    courses: { $in: user.courses },
    role: "student",
  }).select("name email avatarUrl courses");

  res.json({
    students: students.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      avatarUrl: s.avatarUrl || "",
    })),
  });
});

module.exports = router;
module.exports.createNotificationsForCourse = createNotificationsForCourse;
