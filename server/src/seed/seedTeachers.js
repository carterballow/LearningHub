const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Course = require("../models/Courses");

/**
 * Seeds 4 teacher accounts — one per default course.
 * Safe to run on every server startup; uses upsert so it won't duplicate.
 *
 * Login credentials for demo:
 *   nachenberg@cs.ucla.edu  / BruinCode2024!
 *   sarkar@math.ucla.edu    / BruinMath2024!
 *   sfarmer@history.ucla.edu / BruinHist2024!
 *   tcarter@physics.ucla.edu / BruinPhys2024!
 */

const TEACHER_ACCOUNTS = [
  {
    name: "Carey Nachenberg",
    email: "nachenberg@cs.ucla.edu",
    password: "BruinCode2024!",
    courseCode: "CS31",
  },
  {
    name: "Sucharit Sarkar",
    email: "sarkar@math.ucla.edu",
    password: "BruinMath2024!",
    courseCode: "MATH61",
  },
  {
    name: "Sarah Farmer",
    email: "sfarmer@history.ucla.edu",
    password: "BruinHist2024!",
    courseCode: "HIST21",
  },
  {
    name: "Troy Carter",
    email: "tcarter@physics.ucla.edu",
    password: "BruinPhys2024!",
    courseCode: "PHYS1A",
  },
];

async function seedTeachers() {
  console.log("👩‍🏫 Seeding teacher accounts...");

  for (const t of TEACHER_ACCOUNTS) {
    // Find the course this teacher teaches
    const course = await Course.findOne({ code: t.courseCode });
    if (!course) {
      console.warn(`  ⚠️  Course ${t.courseCode} not found — skipping ${t.email}`);
      continue;
    }

    // Check if teacher already exists
    const existing = await User.findOne({ email: t.email });

    if (existing) {
      // Update their course list in case it changed
      existing.role = "teacher";
      existing.courses = [course._id];
      await existing.save();
      console.log(`  ✅ Updated teacher: ${t.email}`);
    } else {
      const passwordHash = await bcrypt.hash(t.password, 12);
      await User.create({
        name: t.name,
        email: t.email,
        passwordHash,
        role: "teacher",
        courses: [course._id],
      });
      console.log(`  ✅ Created teacher: ${t.email}`);
    }
  }

  console.log("✅ Teacher seeding complete");
}

module.exports = { seedTeachers };
