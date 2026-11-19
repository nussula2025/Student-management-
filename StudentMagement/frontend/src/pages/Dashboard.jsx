import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const [count, setCount] = useState(null);

  useEffect(() => {
    api("/students").then((rows) => setCount(rows.length)).catch(() => setCount(null));
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <h1>Student Management Dashboard</h1>
          <p>Welcome, {user?.username}. BULINGA Technical Secondary School.</p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Students</h3>
              <p><strong>{count ?? "-"}</strong> registered students.</p>
              <Link to="/students">View all records</Link>
            </div>

            <div className="dashboard-card">
              <h3>Add Student</h3>
              <p>Register a new student.</p>
              <Link to="/students?add=1">Add student</Link>
            </div>

            <div className="dashboard-card">
              <h3>Your Role</h3>
              <p>{user?.role === "admin" ? "Administrator: can add, edit and delete." : "Teacher: can add, view and edit."}</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
