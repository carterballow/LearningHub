function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// 4 default courses
const DEFAULT_COURSES = [
  { code: "CS31", title: "Intro to Computer Science", color: "#6366f1" },
  { code: "MATH61", title: "Discrete Structures", color: "#22c55e" },
  { code: "HIST21", title: "World History", color: "#f59e0b" },
  { code: "PHYS1A", title: "Physics: Mechanics", color: "#ef4444" },
];

// 12 assignments PER COURSE (some past, some future)
// We generate them from a simple schedule so you don’t hardcode 48 titles manually.
function buildAssignmentsForCourse(courseCode) {
  // 12 due dates: 4 in past, 8 in future (you can tweak)
  const offsets = [-28, -21, -14, -7, 3, 7, 10, 14, 18, 21, 28, 35];

  return offsets.map((offset, i) => ({
    title: `${courseCode} Assignment ${i + 1}`,
    type: i === 5 ? "quiz" : "homework",
    dueDate: daysFromNow(offset),
  }));
}

module.exports = { DEFAULT_COURSES, buildAssignmentsForCourse };
