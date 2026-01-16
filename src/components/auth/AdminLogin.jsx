import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.get(
      `/users?email=${email}&password=${password}&role=admin`
    );

    if (res.data.length) {
      localStorage.setItem("user", JSON.stringify(res.data[0]));
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      <input className="form-control mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-danger" onClick={handleLogin}>
        Login as Admin
      </button>
    </div>
  );
}

export default AdminLogin;
