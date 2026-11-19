import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Login.css";
import "./Register.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await register(form.username, form.password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Register</h1>
          {error && <p className="auth-error">{error}</p>}
          <label>Username
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required minLength={3} />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </label>
          <label>Confirm password
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
          <p>Already registered? <Link to="/login">Login</Link></p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Register;
