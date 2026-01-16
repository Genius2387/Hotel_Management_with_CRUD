import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

function AdminStats() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, roomsRes, bookingsRes, messagesRes] = await Promise.all([
        api.get("/users"),
        api.get("/rooms"),
        api.get("/bookings"),
        api.get("/messages").catch(() => ({ data: [] })) // Handle if messages don't exist yet
      ]);

      setUsers(usersRes.data.filter(u => u.role === "user"));
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmed = bookings.filter(b => b.status === "confirmed");
  const pending = bookings.filter(b => b.status === "pending");
  const cancelled = bookings.filter(b => b.status === "cancelled");
  const unreadMessages = messages.filter(m => m.status === "unread");

  const totalRevenue = confirmed.reduce((sum, booking) => 
    sum + (booking.totalPrice || booking.price || 0), 0
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="row g-3 mt-2">
      {/* Total Users - Clickable */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100 hover-card"
          style={{ 
            cursor: "pointer", 
            transition: "all 0.3s",
            borderLeft: "4px solid #0d6efd"
          }}
          onClick={() => navigate("/admin/users")}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Total Users</h6>
              <span className="fs-3">👥</span>
            </div>
            <h2 className="fw-bold text-primary mb-0">{users.length}</h2>
            <small className="text-muted">Registered users</small>
          </div>
          <div className="card-footer bg-transparent border-0">
            <small className="text-primary">Click to view all →</small>
          </div>
        </div>
      </div>

      {/* Total Rooms - Clickable */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100 hover-card"
          style={{ 
            cursor: "pointer", 
            transition: "all 0.3s",
            borderLeft: "4px solid #198754"
          }}
          onClick={() => navigate("/admin/manage-rooms")}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Total Rooms</h6>
              <span className="fs-3">🏨</span>
            </div>
            <h2 className="fw-bold text-success mb-0">{rooms.length}</h2>
            <small className="text-muted">Available rooms</small>
          </div>
          <div className="card-footer bg-transparent border-0">
            <small className="text-success">Click to manage →</small>
          </div>
        </div>
      </div>

      {/* Total Bookings - Clickable */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100 hover-card"
          style={{ 
            cursor: "pointer", 
            transition: "all 0.3s",
            borderLeft: "4px solid #ffc107"
          }}
          onClick={() => navigate("/admin/view-bookings")}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Total Bookings</h6>
              <span className="fs-3">📋</span>
            </div>
            <h2 className="fw-bold text-warning mb-0">{bookings.length}</h2>
            <small className="text-muted">
              <span className="badge bg-warning text-dark me-1">{pending.length} Pending</span>
            </small>
          </div>
          <div className="card-footer bg-transparent border-0">
            <small className="text-warning">Click to view all →</small>
          </div>
        </div>
      </div>
      
      {/* Contact Messages Card - NEW */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100 hover-card"
          style={{ 
            cursor: "pointer", 
            transition: "all 0.3s",
            borderLeft: "4px solid #0dcaf0"
          }}
          onClick={() => navigate("/admin/messages")}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Messages</h6>
              <span className="fs-3">📬</span>
            </div>
            <h2 className="fw-bold text-info mb-0">{messages.length}</h2>
            <small className="text-muted">
              {unreadMessages.length > 0 && (
                <span className="badge bg-warning text-dark">{unreadMessages.length} Unread</span>
              )}
            </small>
          </div>
          <div className="card-footer bg-transparent border-0">
            <small className="text-info">Click to view all →</small>
          </div>
        </div>
      </div>
      
      {/* Confirmed Bookings */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100"
          style={{ borderLeft: "4px solid #198754" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Confirmed</h6>
              <span className="fs-3">✅</span>
            </div>
            <h2 className="fw-bold text-success mb-0">{confirmed.length}</h2>
            <small className="text-muted">Active bookings</small>
          </div>
        </div>
      </div>

      {/* Cancelled Bookings - NEW */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100"
          style={{ borderLeft: "4px solid #dc3545" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Cancelled</h6>
              <span className="fs-3">❌</span>
            </div>
            <h2 className="fw-bold text-danger mb-0">{cancelled.length}</h2>
            <small className="text-muted">Cancelled bookings</small>
          </div>
        </div>
      </div>

      {/* Pending Bookings Card - NEW */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100"
          style={{ borderLeft: "4px solid #fd7e14" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Pending</h6>
              <span className="fs-3">⏳</span>
            </div>
            <h2 className="fw-bold text-warning mb-0">{pending.length}</h2>
            <small className="text-muted">Awaiting confirmation</small>
          </div>
        </div>
      </div>

      {/* Revenue Card - NEW */}
      <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100"
          style={{ borderLeft: "4px solid #20c997" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Total Revenue</h6>
              <span className="fs-3">💰</span>
            </div>
            <h2 className="fw-bold text-success mb-0">₹{totalRevenue.toLocaleString('en-IN')}</h2>
            <small className="text-muted">From confirmed bookings</small>
          </div>
        </div>
      </div>

      {/* Average Booking Value - NEW */}
      {/* <div className="col-lg-3 col-md-6">
        <div 
          className="card text-center shadow-sm h-100"
          style={{ borderLeft: "4px solid #6f42c1" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-muted mb-0">Avg. Booking</h6>
              <span className="fs-3">📊</span>
            </div>
            <h2 className="fw-bold text-purple mb-0">
              ₹{confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length).toLocaleString('en-IN') : 0}
            </h2>
            <small className="text-muted">Per booking</small>
          </div>
        </div>
      </div> */}

      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default AdminStats;