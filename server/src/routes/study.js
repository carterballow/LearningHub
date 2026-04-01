const express = require("express");
const jwt = require("jsonwebtoken");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require("../models/Users");
const Course = require("../models/Courses");
const Assignment = require("../models/Assignments");
const UserAssignment = require("../models/UserAssignments");

const router = express.Router();

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireUser(req, res) {
  const token = req.cookies?.token;
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return null; }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) { res.status(401).json({ error: "Unauthorized" }); return null; }
    return user;
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
}

function getAIClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === "") return null;
  return new GoogleGenerativeAI(key);
}

async function askGemini(prompt) {
  const client = getAIClient();
  if (!client) throw new Error("GEMINI_API_KEY not set in server/.env");
  const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── Build course context string ──────────────────────────────────────────────

async function buildCourseContext(courseId) {
  if (!courseId) return "";
  const course = await Course.findById(courseId);
  if (!course) return "";

  const assignments = await Assignment.find({ course: course._id }).sort({ dueDate: 1 });
  const today = new Date();
  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const upcoming = assignments.filter((a) => new Date(a.dueDate) > today);
  const past = assignments.filter((a) => new Date(a.dueDate) <= today);

  return `COURSE: ${course.code} — ${course.title}
Instructor: ${course.instructor}
Schedule: ${course.schedule}
Description: ${course.description}

UPCOMING ASSIGNMENTS:
${upcoming.map((a) => `- [${a.type.toUpperCase()}] ${a.title} (due ${fmt(a.dueDate)}, ${a.maxScore} pts)\n  ${a.description}`).join("\n") || "None"}

PAST ASSIGNMENTS:
${past.map((a) => `- [${a.type.toUpperCase()}] ${a.title} (was due ${fmt(a.dueDate)})\n  ${a.description}`).join("\n") || "None"}`;
}

// ─── POST /api/study/chat ──────────────────────────────────────────────────────

router.post("/chat", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { courseId, message, history } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

  if (!getAIClient()) return res.status(503).json({ error: "AI tutor not configured. Add GEMINI_API_KEY to server/.env" });

  const courseContext = await buildCourseContext(courseId);

  const systemInstruction = `You are a helpful, encouraging AI tutor for college students.
You have detailed knowledge of the student's course and assignments.
${courseContext || "No specific course selected."}
Help with: assignments, deadlines, concept explanations, study planning. Be concise and supportive.`;

  // Build Gemini message history — must start with a user message
  const geminiHistory = [];
  if (Array.isArray(history)) {
    let started = false;
    for (const turn of history.slice(-10)) {
      if (!started && turn.role !== "user") continue; // skip leading assistant messages
      started = true;
      if (turn.role === "user") geminiHistory.push({ role: "user", parts: [{ text: turn.content }] });
      else if (turn.role === "assistant") geminiHistory.push({ role: "model", parts: [{ text: turn.content }] });
    }
  }

  try {
    const client = getAIClient();
    const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash", systemInstruction });
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message.trim());
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Gemini chat error:", err.message);
    res.status(500).json({ error: "AI request failed: " + err.message });
  }
});

// ─── POST /api/study/quiz ──────────────────────────────────────────────────────

router.post("/quiz", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { courseId, topic, count = 5 } = req.body;

  if (!getAIClient()) return res.status(503).json({ error: "AI not configured. Add GEMINI_API_KEY to server/.env" });

  const courseContext = await buildCourseContext(courseId);

  const prompt = `${courseContext ? courseContext + "\n\n" : ""}Generate exactly ${count} multiple-choice quiz questions${topic ? ` about: ${topic}` : " based on the course content above"}.

Return ONLY valid JSON in this exact format, no markdown, no code fences:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) option one", "B) option two", "C) option three", "D) option four"],
      "answer": "A",
      "explanation": "Brief explanation of why A is correct."
    }
  ]
}`;

  try {
    let text = await askGemini(prompt);
    text = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error("Quiz gen error:", err.message);
    res.status(500).json({ error: "Failed to generate quiz: " + err.message });
  }
});

// ─── POST /api/study/flashcards ───────────────────────────────────────────────

router.post("/flashcards", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { courseId, topic, count = 10 } = req.body;

  if (!getAIClient()) return res.status(503).json({ error: "AI not configured. Add GEMINI_API_KEY to server/.env" });

  const courseContext = await buildCourseContext(courseId);

  const prompt = `${courseContext ? courseContext + "\n\n" : ""}Generate exactly ${count} flashcards${topic ? ` about: ${topic}` : " covering key concepts from the course above"}.

Return ONLY valid JSON, no markdown, no code fences:
{
  "flashcards": [
    { "front": "Term or question", "back": "Definition or answer" }
  ]
}`;

  try {
    let text = await askGemini(prompt);
    text = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    console.error("Flashcard gen error:", err.message);
    res.status(500).json({ error: "Failed to generate flashcards: " + err.message });
  }
});

// ─── GET /api/study/plan ──────────────────────────────────────────────────────

router.get("/plan", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userAssignments = await UserAssignment.find({ user: user._id })
    .populate({ path: "assignment", match: { dueDate: { $gte: today } } })
    .populate("course");

  const upcoming = userAssignments
    .filter((ua) => ua.assignment !== null && ua.status !== "done")
    .map((ua) => {
      const daysUntil = Math.ceil((new Date(ua.assignment.dueDate) - today) / (1000 * 60 * 60 * 24));
      return {
        userAssignmentId: ua._id,
        courseCode: ua.course?.code,
        courseTitle: ua.course?.title,
        title: ua.assignment.title,
        type: ua.assignment.type,
        description: ua.assignment.description,
        dueDate: ua.assignment.dueDate,
        maxScore: ua.assignment.maxScore,
        daysUntil,
        status: ua.status,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const exams = upcoming.filter((a) => a.type === "exam");
  const regular = upcoming.filter((a) => a.type !== "exam");

  const studyTimeline = exams.map((exam) => {
    const days = exam.daysUntil;
    const plan = [];
    if (days <= 1) {
      plan.push({ day: "Today", focus: "Last-minute review", tasks: ["Review all notes", "Skim past assignments", "Get a good night's sleep"] });
    } else if (days <= 3) {
      plan.push({ day: "Today", focus: "Core concept review", tasks: ["Re-read your notes from the last 2 weeks", "List topics you're least confident on"] });
      plan.push({ day: "Tomorrow", focus: "Practice problems", tasks: ["Do 5–10 practice problems", "Focus on weak areas identified today"] });
      if (days === 3) plan.push({ day: "Day before exam", focus: "Final review", tasks: ["Light review only", "Sleep 8 hours", "Eat breakfast"] });
    } else if (days <= 7) {
      plan.push({ day: "Days 1–2", focus: "Content review", tasks: ["Go through all assignment descriptions", "Review notes chapter by chapter", "Identify 3 weakest topics"] });
      plan.push({ day: "Days 3–4", focus: "Active practice", tasks: ["Redo past homework problems", "Quiz yourself on key formulas/definitions", "Use AI Tutor for anything confusing"] });
      plan.push({ day: "Days 5–6", focus: "Mock exam", tasks: ["Time yourself on practice problems", "Simulate exam conditions"] });
      plan.push({ day: "Day before", focus: "Rest", tasks: ["Review summary notes only", "Sleep 8 hours", "Prep your materials tonight"] });
    } else {
      plan.push({ day: `${days - 6}+ days out`, focus: "Big picture review", tasks: ["Read all assignment descriptions", "Make a concept map", "Identify topics that appear repeatedly"] });
      plan.push({ day: "Week 1–2", focus: "Deep dives", tasks: ["Spend 1–2 hours per major topic", "Complete any unfinished assignments", "Use AI Tutor to fill gaps"] });
      plan.push({ day: "3–5 days before", focus: "Practice", tasks: ["Timed practice problems", "Review graded feedback", "Make a summary sheet"] });
      plan.push({ day: "1–2 days before", focus: "Polish", tasks: ["Light review only", "Fix your 3 weakest areas", "Normalize your sleep schedule"] });
      plan.push({ day: "Day of", focus: "Game day", tasks: ["Eat a real meal", "Arrive 10 min early", "Read questions carefully"] });
    }
    return { exam: { title: exam.title, courseCode: exam.courseCode, courseTitle: exam.courseTitle, dueDate: exam.dueDate, daysUntil: exam.daysUntil, maxScore: exam.maxScore }, plan };
  });

  res.json({ upcomingAssignments: upcoming, exams, studyTimeline, regularAssignments: regular });
});

// ─── GET /api/study/weakness ──────────────────────────────────────────────────

router.get("/weakness", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const gradedUAs = await UserAssignment.find({ user: user._id, grade: { $ne: null } })
    .populate("assignment", "title type maxScore description")
    .populate("course", "code title color");

  const byType = {};
  const byCourse = {};

  for (const ua of gradedUAs) {
    if (!ua.assignment || !ua.course) continue;
    const pct = Math.round((ua.grade / ua.assignment.maxScore) * 100);
    const type = ua.assignment.type;
    const courseCode = ua.course.code;

    if (!byType[type]) byType[type] = { total: 0, count: 0, items: [] };
    byType[type].total += pct;
    byType[type].count += 1;
    byType[type].items.push({ title: ua.assignment.title, pct, grade: ua.grade, maxScore: ua.assignment.maxScore });

    if (!byCourse[courseCode]) byCourse[courseCode] = { total: 0, count: 0, color: ua.course.color, title: ua.course.title };
    byCourse[courseCode].total += pct;
    byCourse[courseCode].count += 1;
  }

  const typeStats = Object.entries(byType).map(([type, v]) => ({
    type, avg: Math.round(v.total / v.count), count: v.count, items: v.items,
  })).sort((a, b) => a.avg - b.avg);

  const courseStats = Object.entries(byCourse).map(([code, v]) => ({
    code, title: v.title, color: v.color, avg: Math.round(v.total / v.count), count: v.count,
  })).sort((a, b) => a.avg - b.avg);

  res.json({ gradedCount: gradedUAs.length, typeStats, courseStats });
});

module.exports = router;
