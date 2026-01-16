import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Weak", color: "#dc3545" };
    if (strength <= 3) return { strength: 66, label: "Medium", color: "#ffc107" };
    return { strength: 100, label: "Strong", color: "#198754" };
  };

  const passwordStrength = getPasswordStrength(user.password);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (user.phone && !/^[0-9]{10}$/.test(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!agreedToTerms) {
      toast.warning("Please accept the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const existingUser = await api.get(`/users?email=${user.email}`);
      
      if (existingUser.data.length > 0) {
        toast.error("Email already registered. Please login instead.");
        setLoading(false);
        return;
      }

      // Register new user
      await api.post("/users", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: "user",
        createdAt: new Date().toISOString()
      });

      toast.success("Registration successful! Please login to continue 🎉");
      
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            {/* Register Card */}
            <div className="card shadow-lg border-0" style={{ borderRadius: "10px" }}>
              <div className="card-body p-4">
                {/* Logo/Header */}
                <div className="text-center mb-2">
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join OceanView Hotel today!</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <span>👤</span>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter your full name"
                        value={user.name}
                        required
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <span>📧</span>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter your email"
                        value={user.email}
                        required
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                  </div>  

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <span>🔒</span>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0 ps-0"
                        placeholder="Create a strong password"
                        value={user.password}
                        required
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                      />
                      <button
                        className="btn btn-light border-start-0"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {user.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password Strength:</small>
                          <small style={{ color: passwordStrength.color, fontWeight: "600" }}>
                            {passwordStrength.label}
                          </small>
                        </div>
                        <div className="progress" style={{ height: "4px" }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${passwordStrength.strength}%`,
                              backgroundColor: passwordStrength.color,
                              transition: "all 0.3s"
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          Use 8+ characters with mix of letters, numbers & symbols
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <span>🔑</span>
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0 ps-0"
                        placeholder="Re-enter your password"
                        value={user.confirmPassword}
                        required
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                      />
                      <button
                        className="btn btn-light border-start-0"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {user.confirmPassword && (
                      <small className={user.password === user.confirmPassword ? "text-success" : "text-danger"}>
                        {user.password === user.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                      </small>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="agreeTerms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        required
                      />
                      <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                        I agree to the{" "}
                        <a 
                          href="#" 
                          className="text-decoration-none"
                          style={{ color: "#667eea" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info("Terms and Conditions page");
                          }}
                        >
                          Terms and Conditions
                        </a>
                        {" "}and{" "}
                        <a 
                          href="#" 
                          className="text-decoration-none"
                          style={{ color: "#667eea" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info("Privacy Policy page");
                          }}
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold mb-3"
                    disabled={loading}
                    style={{
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      border: "none",
                      borderRadius: "5px"
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="text-center mb-3">
                    <div className="d-flex align-items-center">
                      <hr className="flex-grow-1"/>
                      <span className="px-3 text-muted small">OR</span>
                      <hr className="flex-grow-1"/>
                    </div>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{" "}
                      <Link 
                        to="/login" 
                        className="fw-semibold text-decoration-none"
                        style={{ color: "#667eea" }}
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;