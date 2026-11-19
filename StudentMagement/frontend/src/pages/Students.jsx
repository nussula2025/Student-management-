import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import "./Dashboard.css";
import "./Students.css";

const EMPTY = { FirstName: "", LastName: "", Gender: "Male", DateOfBirth: "", Class: "", PhoneNumber: "", Email: "" };

function Students() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null); // null = form hidden
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(q = search) {
    try {
      setError("");
      setStudents(await api(`/students?search=${encodeURIComponent(q)}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(""); /* initial load */ }, []);
  useEffect(() => { if (params.get("add")) openAdd(); }, [params]); // sidebar "Add Student" link

  function openAdd() { setEditingId(null); setFormError(""); setForm(EMPTY); }
  function openEdit(s) {
    setEditingId(s.StudentID);
    setFormError("");
    setForm({ ...EMPTY, ...s, DateOfBirth: String(s.DateOfBirth).slice(0, 10) });
  }
  function closeForm() { setForm(null); setEditingId(null); if (params.get("add")) setParams({}); }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");
    try {
      if (editingId) await api(`/students/${editingId}`, { method: "PUT", body: form });
      else await api("/students", { method: "POST", body: form });
      closeForm();
      load();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(s) {
    if (!window.confirm(`Delete ${s.FirstName} ${s.LastName}?`)) return;
    try {
      await api(`/students/${s.StudentID}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="students-page" style={{ flex: 1 }}>
          <h1>Manage Students</h1>
          <p>View and manage student academic records.</p>

          <div className="students-toolbar">
            <button className="add-student-btn" onClick={openAdd}>+ Add New Student</button>
            <input
              className="students-search"
              placeholder="Search by name or class..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          {form && (
            <form className="student-form" onSubmit={handleSave}>
              <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
              {formError && <p className="form-error">{formError}</p>}
              <div className="form-grid">
                <label>First name<input value={form.FirstName} onChange={set("FirstName")} required /></label>
                <label>Last name<input value={form.LastName} onChange={set("LastName")} required /></label>
                <label>Gender
                  <select value={form.Gender} onChange={set("Gender")}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </label>
                <label>Date of birth<input type="date" value={form.DateOfBirth} onChange={set("DateOfBirth")} required /></label>
                <label>Class<input value={form.Class} onChange={set("Class")} placeholder="e.g. L5 SWD" required /></label>
                <label>Phone number<input value={form.PhoneNumber} onChange={set("PhoneNumber")} required /></label>
                <label>Email<input type="email" value={form.Email} onChange={set("Email")} required /></label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">{editingId ? "Update" : "Save"}</button>
                <button type="button" className="btn-cancel" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          )}

          <table>
            <thead>
              <tr>
                <th>ID</th><th>First Name</th><th>Last Name</th><th>Gender</th>
                <th>Date of Birth</th><th>Class</th><th>Phone</th><th>Email</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="9">No students found.</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.StudentID}>
                    <td>{s.StudentID}</td>
                    <td>{s.FirstName}</td>
                    <td>{s.LastName}</td>
                    <td>{s.Gender}</td>
                    <td>{String(s.DateOfBirth).slice(0, 10)}</td>
                    <td>{s.Class}</td>
                    <td>{s.PhoneNumber}</td>
                    <td>{s.Email}</td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(s)}>Edit</button>
                      {user?.role === "admin" && (
                        <button className="btn-delete" onClick={() => handleDelete(s)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Students;
