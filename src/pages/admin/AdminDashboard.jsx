import { Link } from "react-router-dom";
import AdminStats from "./AdminStats";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-vh-100" style={{ background: "#f8f9fa" }}>
      {/* Header Section */}
      <section className="py-4" style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white"
      }}>
        <div className="container">
          <h1 className="display-5 fw-bold mb-2">👨‍💼 Admin Dashboard</h1>
          <p className="mb-0">Welcome back, {user?.name || "Admin"}! Manage your hotel operations here.</p>
        </div>
      </section>

      <div className="container py-4">
        {/* Statistics Cards */}
        <AdminStats />

        
      </div>
    </div>
  );
}

export default AdminDashboard;