import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        api.get("/users"),
        api.get("/bookings")
      ]);

      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load users. Make sure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Get user's booking count
  const getUserBookingCount = (userId) => {
    return bookings.filter(b => b.userId === userId).length;
  };

  // Get user's confirmed bookings count
  const getUserConfirmedBookings = (userId) => {
    return bookings.filter(b => b.userId === userId && b.status === "confirmed").length;
  };

  // Get user's total spending
  const getUserTotalSpent = (userId) => {
    return bookings
      .filter(b => b.userId === userId && b.status === "confirmed")
      .reduce((sum, b) => sum + (b.totalPrice || b.price || 0), 0);
  };

  // Delete user
  const deleteUser = async (userId, userName) => {
    const userBookingCount = getUserBookingCount(userId);
    
    const confirmMessage = userBookingCount > 0
      ? `⚠️ Warning: ${userName} has ${userBookingCount} booking(s).\n\nDeleting this user will NOT delete their bookings.\nAre you sure you want to delete this user?`
      : `Are you sure you want to delete ${userName}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success(`User ${userName} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const regularUsers = filteredUsers.filter(u => u.role === "user");
  const adminUsers = filteredUsers.filter(u => u.role === "admin");

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 All Users</h2>
        <button 
          className="btn btn-primary"
          onClick={fetchData}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary mb-0">{users.length}</h3>
              <small className="text-muted">Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success mb-0">{regularUsers.length}</h3>
              <small className="text-muted">Regular Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-danger mb-0">{adminUsers.length}</h3>
              <small className="text-muted">Admin Users</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select form-select-lg"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted mb-3">
        <strong>Showing {filteredUsers.length} of {users.length} users</strong>
      </p>

      {filteredUsers.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No users found</h5>
          <p className="mb-0">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="row">
          {filteredUsers.map(user => {
            const bookingCount = getUserBookingCount(user.id);
            const confirmedCount = getUserConfirmedBookings(user.id);
            const totalSpent = getUserTotalSpent(user.id);

            return (
              <div key={user.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{user.name}</span>
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <p className="mb-2">
                        <strong>📧 Email:</strong><br/>
                        <span className="text-muted">{user.email}</span>
                      </p>
                      <p className="mb-2">
                        <strong>🆔 User ID:</strong> {user.id}
                      </p>
                      {user.phone && (
                        <p className="mb-2">
                          <strong>📱 Phone:</strong> {user.phone}
                        </p>
                      )}
                    </div>

                    <hr />

                    {/* Booking Statistics */}
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Booking Statistics:</h6>
                      <div className="d-flex justify-content-between mb-1">
                        <small>Total Bookings:</small>
                        <span className="badge bg-info">{bookingCount}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <small>Confirmed:</small>
                        <span className="badge bg-success">{confirmedCount}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small>Total Spent:</small>
                        <span className="badge bg-success">₹{totalSpent.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {bookingCount === 0 && (
                      <div className="alert alert-light py-2 mb-2">
                        <small className="text-muted">No bookings yet</small>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      {user.role !== 'admin' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(user.id, user.name)}
                        >
                          🗑️ Delete User
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled
                        >
                          🔒 Cannot Delete Admin
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Text */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 alert alert-light">
          <small>
            💡 <strong>Note:</strong> Deleting a user will not delete their bookings. 
            User information will show as "User not found" in booking records.
            Admin users cannot be deleted for security reasons.
          </small>
        </div>
      )}
    </div>
  );
}

export default ViewUsers;