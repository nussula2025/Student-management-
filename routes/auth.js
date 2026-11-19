import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const signToken = (u) =>
  jwt.sign({ id: u.UserID, username: u.UserName, role: u.Role }, process.env.JWT_SECRET, { expiresIn: "8h" });

// POST /api/auth/register  { username, password }
// The first account created becomes "admin"; everyone after is "teacher".
router.post("/register", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (username.length < 3) return res.status(400).json({ message: "Username must be at least 3 characters" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

  const [existing] = await db.query("SELECT UserID FROM Users WHERE UserName = ?", [username]);
  if (existing.length) return res.status(409).json({ message: "Username already taken" });

  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM Users");
  const role = Number(total) === 0 ? "admin" : "teacher";
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query("INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)", [username, hash, role]);
  res.status(201).json({ message: "Registration successful", user: { id: result.insertId, username, role } });
});

// POST /api/auth/login  { username, password }
router.post("/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const [rows] = await db.query("SELECT * FROM Users WHERE UserName = ?", [username]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.Password)))
    return res.status(401).json({ message: "Invalid username or password" });
  res.json({ token: signToken(user), user: { id: user.UserID, username: user.UserName, role: user.Role } });
});

// GET /api/auth/me  (token required)
router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

export default router;
