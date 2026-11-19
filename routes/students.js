import { Router } from "express";
import db from "../config/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(authenticate); // every student route needs a valid login

const SELECT = `SELECT StudentID, FirstName, LastName, Gender, DateOfBirth, Class, PhoneNumber, Email FROM Students`;

function validate(b) {
  const s = (v) => String(v ?? "").trim();
  const d = {
    FirstName: s(b.FirstName), LastName: s(b.LastName), Gender: s(b.Gender),
    DateOfBirth: s(b.DateOfBirth), Class: s(b.Class), PhoneNumber: s(b.PhoneNumber), Email: s(b.Email),
  };
  for (const [k, v] of Object.entries(d)) if (!v) return { error: `${k} is required` };
  if (!["Male", "Female"].includes(d.Gender)) return { error: "Gender must be Male or Female" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.DateOfBirth) || isNaN(Date.parse(d.DateOfBirth)))
    return { error: "DateOfBirth must be a valid date (YYYY-MM-DD)" };
  if (!/^\S+@\S+\.\S+$/.test(d.Email)) return { error: "Email is not valid" };
  if (!/^[0-9+\-\s]{7,20}$/.test(d.PhoneNumber)) return { error: "PhoneNumber is not valid" };
  return { data: d };
}

const dupGuard = (err, res) => {
  if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "A student with this email already exists" });
  throw err;
};

// READ all (optional ?search=)
router.get("/", async (req, res) => {
  const q = String(req.query.search || "").trim();
  const [rows] = q
    ? await db.query(`${SELECT} WHERE FirstName LIKE ? OR LastName LIKE ? OR Class LIKE ? ORDER BY StudentID DESC`, [`%${q}%`, `%${q}%`, `%${q}%`])
    : await db.query(`${SELECT} ORDER BY StudentID DESC`);
  res.json(rows);
});

// READ one
router.get("/:id", async (req, res) => {
  const [rows] = await db.query(`${SELECT} WHERE StudentID = ?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Student not found" });
  res.json(rows[0]);
});

// CREATE
router.post("/", async (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const [r] = await db.query(
      "INSERT INTO Students (FirstName, LastName, Gender, DateOfBirth, Class, PhoneNumber, Email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.FirstName, data.LastName, data.Gender, data.DateOfBirth, data.Class, data.PhoneNumber, data.Email]
    );
    res.status(201).json({ StudentID: r.insertId, ...data });
  } catch (e) { dupGuard(e, res); }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const [r] = await db.query(
      "UPDATE Students SET FirstName=?, LastName=?, Gender=?, DateOfBirth=?, Class=?, PhoneNumber=?, Email=? WHERE StudentID=?",
      [data.FirstName, data.LastName, data.Gender, data.DateOfBirth, data.Class, data.PhoneNumber, data.Email, req.params.id]
    );
    if (!r.affectedRows) return res.status(404).json({ message: "Student not found" });
    res.json({ StudentID: Number(req.params.id), ...data });
  } catch (e) { dupGuard(e, res); }
});

// DELETE (admin only)
router.delete("/:id", requireRole("admin"), async (req, res) => {
  const [r] = await db.query("DELETE FROM Students WHERE StudentID = ?", [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Student deleted" });
});

export default router;
