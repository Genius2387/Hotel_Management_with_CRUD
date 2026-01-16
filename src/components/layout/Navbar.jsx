import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container-fluid px-4">
        {/* LOGO */}
        <NavLink className="navbar-brand fw-bold fs-3" to="/">
          OceanView Hotel
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* CENTER LINKS (COMMON FOR ALL) */}
          <ul className="navbar-nav mx-auto">
            
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/rooms">Rooms</NavLink>
            </li>
            {(!user || user.role !== "admin") && (
            <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">Services</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery">Gallery</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
            </>
            )}

            {/* USER ONLY */}
            {user && user.role === "user" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-bookings">
                  My Bookings
                </NavLink>
              </li>
            )}
          </ul>

          {/* RIGHT SIDE ACTIONS */}
          {!user ? (
            <div className="d-flex gap-2">
              <NavLink to="/login" className="btn btn-outline-light px-3">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary px-3">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white me-2">
                Hi, {user.name || user.role}
              </span>

              {/* ADMIN BUTTONS */}
              {user.role === "admin" && (
                <>
                  <button
                    className="btn btn-primary px-3"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Dashboard
                  </button>

                  <button
                    className="btn btn-secondary px-3"
                    onClick={() => navigate("/admin/manage-rooms")}
                  >
                    Manage Rooms
                  </button>

                  <button
                    className="btn btn-success px-3"
                    onClick={() => navigate("/admin/view-bookings")}
                  >
                    View Bookings
                  </button>
                </>
              )}

              {/* USER BUTTON */}
              {user.role === "user" && (
                <button
                  className="btn btn-primary px-3"
                  onClick={() => navigate("/booking")}
                >
                  Book Now
                </button>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-danger px-3"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
