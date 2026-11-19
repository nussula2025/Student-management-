import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>BULINGA SCHOOL</h2>
        <p>Student Management System</p>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Home</Link>
            <Link to="/students">Students</Link>
            <span>{user.username} ({user.role})</span>
            <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); navigate("/login"); }}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
