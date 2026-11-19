import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Sidebar.css";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h3>MENU</h3>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/students">Manage Students</Link></li>
        <li><Link to="/students?add=1">Add Student</Link></li>
        <li><a href="#logout" onClick={(e) => { e.preventDefault(); logout(); navigate("/login"); }}>Logout{user ? ` (${user.username})` : ""}</a></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
