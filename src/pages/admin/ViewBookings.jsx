import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings");
      const sortedBookings = res.data.sort((a, b) => 
        new Date(b.bookedAt || 0) - new Date(a.bookedAt || 0)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      fetchBookings();
      alert(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
      alert("Booking deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete booking");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning",
      confirmed: "bg-success",
      cancelled: "bg-danger"
    };
    return badges[status] || "bg-secondary";
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.room?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">All Bookings</h2>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by guest name or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Count */}
      <p className="text-muted mb-3">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>

      {filteredBookings.length === 0 ? (
        <div className="alert alert-info">No bookings found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Guest Name</th>
                <th>Phone</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.phone || "N/A"}</td>
                  <td>{b.room}</td>
                  <td>{new Date(b.fromDate).toLocaleDateString('en-IN')}</td>
                  <td>{new Date(b.toDate).toLocaleDateString('en-IN')}</td>
                  <td>{b.guests}</td>
                  <td>₹{b.totalPrice || b.price}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      {b.status === "pending" && (
                        <button 
                          className="btn btn-success"
                          onClick={() => updateStatus(b.id, "confirmed")}
                        >
                          Confirm
                        </button>
                      )}
                      <button 
                        className="btn btn-danger"
                        onClick={() => deleteBooking(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewBookings;