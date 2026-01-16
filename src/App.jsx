import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/* Public Pages */
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";

/* Auth Pages */
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminLogin from "./components/auth/AdminLogin";

/* Admin Pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ViewBookings from "./pages/admin/ViewBookings";
import ViewUsers from "./pages/admin/ViewUsers";
import ViewMessages from "./pages/admin/ViewMessages";

/* User Pages */
import MyBookings from "./pages/user/MyBookings";

/* Protected Route */
import ProtectedRoute from "./components/protected/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />

          {/* ---------- Auth Routes ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ---------- User Protected Routes ---------- */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="user">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute role="user">
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* ---------- Admin Protected Routes ---------- */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-rooms"
            element={
              <ProtectedRoute role="admin">
                <ManageRooms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/view-bookings"
            element={
              <ProtectedRoute role="admin">
                <ViewBookings />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/users" 
            element={
            <ProtectedRoute role="admin">
            <ViewUsers />
            </ProtectedRoute>
          } 
          />
          <Route 
            path="/admin/messages" 
            element={
            <ProtectedRoute role="admin">
            <ViewMessages />
            </ProtectedRoute>
          } 
          />

          {/* ---------- Fallback ---------- */}
          <Route
            path="*"
            element={<h2 className="text-center mt-5">404 – Page Not Found</h2>}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
