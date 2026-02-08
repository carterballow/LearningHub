const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectDB } = require("./db");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Allow your client to send cookies
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", dataRoutes);


const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`✅ Server on http://localhost:${port}`)))
  .catch(err => {
    console.error("❌ DB connect failed", err);
    process.exit(1);
  });
