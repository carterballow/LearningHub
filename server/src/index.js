const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./db");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const studyRoutes = require("./routes/study");

const { upsertCoursesAndAssignments } = require("./seed/seedForNewUsers");
const { seedTeachers } = require("./seed/seedTeachers");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", dataRoutes);
app.use("/api/study", studyRoutes);

const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ DB connected");

    // Upsert 4 default courses and clean up any seeded assignments
    await upsertCoursesAndAssignments();
    console.log("✅ Courses upserted, seeded assignments cleaned up");

    // Ensure teacher accounts exist
    await seedTeachers();

    app.listen(port, () => console.log(`✅ Server on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("❌ DB connect failed", err);
    process.exit(1);
  });
