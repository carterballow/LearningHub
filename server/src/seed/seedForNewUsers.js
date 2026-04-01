const Course = require("../models/Courses");
const Assignment = require("../models/Assignments");
const UserAssignment = require("../models/UserAssignments");
const { STEM_COURSES, GE_COURSES, ASSIGNMENTS_BY_COURSE } = require("./defaults");

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

async function upsertCoursesAndAssignments() {
  const allCourses = [...STEM_COURSES, ...GE_COURSES];
  const courseDocs = {};

  for (const c of allCourses) {
    const { gradingScheme, ...rest } = c;
    const doc = await Course.findOneAndUpdate(
      { code: c.code },
      {
        $set: {
          ...rest,
          ...(gradingScheme ? { gradingScheme: new Map(Object.entries(gradingScheme)) } : {}),
        },
      },
      { upsert: true, new: true }
    );
    courseDocs[c.code] = doc;

    const courseAssignments = ASSIGNMENTS_BY_COURSE[c.code] || [];
    for (const a of courseAssignments) {
      await Assignment.findOneAndUpdate(
        { course: doc._id, seedKey: a.seedKey },
        {
          $setOnInsert: {
            course: doc._id,
            seedKey: a.seedKey,
            title: a.title,
            description: a.description,
            type: a.type,
            dueDate: a.dueDate,
            maxScore: a.maxScore,
            attachmentUrl: "",
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  return courseDocs;
}

async function enrollUserInDefaultCourses(user) {
  const courseDocs = await upsertCoursesAndAssignments();

  const selectedStem = pickRandom(STEM_COURSES, 3).map((c) => c.code);
  const selectedGe = pickRandom(GE_COURSES, 1).map((c) => c.code);
  const selectedCodes = [...selectedStem, ...selectedGe];

  user.courses = selectedCodes.map((code) => courseDocs[code]._id);
  await user.save();

  const now = new Date();

  for (const code of selectedCodes) {
    const courseDoc = courseDocs[code];
    const assignments = await Assignment.find({ course: courseDoc._id, seedKey: { $exists: true } });
    for (const a of assignments) {
      const isPast = new Date(a.dueDate) < now;
      const pct = isPast ? (85 + Math.floor(Math.random() * 14)) : 0;
      const grade = isPast ? Math.round((pct / 100) * a.maxScore) : undefined;
      const submittedAt = isPast
        ? new Date(new Date(a.dueDate).getTime() - Math.floor(Math.random() * 86400000))
        : undefined;

      await UserAssignment.findOneAndUpdate(
        { user: user._id, assignment: a._id },
        {
          $setOnInsert: {
            user: user._id,
            course: courseDoc._id,
            assignment: a._id,
            status: isPast ? "done" : "todo",
            ...(isPast ? { grade, feedback: "", submissionText: ":)", submittedAt } : {}),
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  return { courseCount: selectedCodes.length };
}

async function seedDefaultsAndAssignToUser(user) {
  return enrollUserInDefaultCourses(user);
}

module.exports = { enrollUserInDefaultCourses, seedDefaultsAndAssignToUser, upsertCoursesAndAssignments };
