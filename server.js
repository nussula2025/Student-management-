import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/database.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Student Management System API is running!"));

app.get("/test-db", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.send("MySQL database connected successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Central error handler (Express 5 forwards async errors here)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
