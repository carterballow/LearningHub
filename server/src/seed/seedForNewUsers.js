const Course = require("../models/Courses");
const Assignment = require("../models/Assignments");
const UserAssignment = require("../models/UserAssignments");
const { DEFAULT_COURSES, buildAssignmentsForCourse } = require("./defaults");

console.log("✅ LOADED seedForNewUsers from:", __filename);

async function seedDefaultsAndAssignToUser(user) {
  console.log("🌱 Seeding started for user:", user._id.toString());
  // 1) Ensure courses exist
  const courseDocs = [];
  for (const c of DEFAULT_COURSES) {
    const doc = await Course.findOneAndUpdate(
      { code: c.code },
      { $setOnInsert: { ...c, term: "Winter 2026" } },
      { upsert: true, new: true }
    );
    courseDocs.push(doc);
  }

  // 2) Ensure each course has 12 template Assignments
  for (const course of courseDocs) {
    const templates = buildAssignmentsForCourse(course.code);

    // Insert many, ignore duplicates (in case you run this again)
    // We use unordered bulk so one duplicate doesn’t stop everything.
    const ops = templates.map((t) => ({
      updateOne: {
        filter: { course: course._id, title: t.title },
        update: { $setOnInsert: { course: course._id, ...t } },
        upsert: true,
      },
    }));
    await Assignment.bulkWrite(ops, { ordered: false });
  }

  // 3) Enroll user in these courses
  user.courses = courseDocs.map((c) => c._id);
  await user.save();

  // 4) Create UserAssignments for this user from templates (48 total)
  const allTemplates = await Assignment.find({ course: { $in: user.courses } }).select("_id course");

  const uaOps = allTemplates.map((tpl) => ({
    updateOne: {
      filter: { user: user._id, assignment: tpl._id },
      update: {
        $setOnInsert: {
          user: user._id,
          course: tpl.course,
          assignment: tpl._id,
          status: "todo",
        },
      },
      upsert: true,
    },
  }));

  await UserAssignment.bulkWrite(uaOps, { ordered: false });

  return { courseCount: courseDocs.length, assignmentTemplateCount: allTemplates.length };
}

module.exports = { seedDefaultsAndAssignToUser };
