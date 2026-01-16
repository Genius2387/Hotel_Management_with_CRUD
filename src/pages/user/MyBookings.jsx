import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

function MyBookings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings?userId=${user.id}`);
      // Sort by booking date (newest first)
      const sortedBookings = res.data.sort((a, b) => 
        new Date(b.bookedAt || 0) - new Date(a.bookedAt || 0)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please ensure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id, bookingDetails) => {
    const confirmMessage = `Are you sure you want to cancel this booking?\n\nRoom: ${bookingDetails.room}\nCheck-in: ${new Date(bookingDetails.fromDate).toLocaleDateString('en-IN')}`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Update booking status to 'cancelled' instead of deleting
      await api.patch(`/bookings/${id}`, { 
        status: "cancelled",
        cancelledAt: new Date().toISOString()
      });
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning text-dark",
      confirmed: "bg-success",
      cancelled: "bg-danger"
    };
    return badges[status] || "bg-secondary";
  };

  const filteredBookings = bookings.filter(b => 
    filterStatus === "all" || b.status === filterStatus
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <select 
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <span style={{ fontSize: "4rem" }}>📅</span>
          </div>
          <h4 className="text-muted">No bookings found</h4>
          <p className="text-muted">
            {filterStatus === "all" 
              ? "Start exploring our rooms and make your first booking!" 
              : `No ${filterStatus} bookings found.`}
          </p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.href = "/rooms"}
          >
            Browse Rooms
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredBookings.map((b) => (
            <div key={b.id} className="col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{b.room}</h5>
                  <span className={`badge ${getStatusBadge(b.status)}`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <p className="mb-2"><strong>Guest Name:</strong> {b.name}</p>
                    {b.phone && <p className="mb-2"><strong>Phone:</strong> {b.phone}</p>}
                    <p className="mb-2"><strong>Check-in:</strong> {new Date(b.fromDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</p>
                    <p className="mb-2"><strong>Check-out:</strong> {new Date(b.toDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</p>
                    <p className="mb-2"><strong>Guests:</strong> {b.guests}</p>
                    {b.numberOfNights && (
                      <p className="mb-2"><strong>Nights:</strong> {b.numberOfNights}</p>
                    )}
                    <p className="mb-2"><strong>Total Price:</strong> <span className="text-success fw-bold fs-5">₹{b.totalPrice || b.price}</span></p>
                    {b.specialRequests && (
                      <div className="alert alert-light mb-2 py-2">
                        <small><strong>Special Requests:</strong> {b.specialRequests}</small>
                      </div>
                    )}
                    {b.bookedAt && (
                      <p className="mb-1"><small className="text-muted">Booked on: {new Date(b.bookedAt).toLocaleString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</small></p>
                    )}
                    {b.cancelledAt && (
                      <p className="mb-1"><small className="text-danger">Cancelled on: {new Date(b.cancelledAt).toLocaleString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</small></p>
                    )}
                  </div>

                  {b.status === "confirmed" && (
                    <div className="alert alert-success mb-3 py-2">
                      ✅ Your booking is confirmed!
                    </div>
                  )}

                  {b.status === "cancelled" && (
                    <div className="alert alert-danger mb-3 py-2">
                      ❌ This booking has been cancelled
                    </div>
                  )}

                  {/* Cancel button - show for pending and confirmed bookings */}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button
                      onClick={() => cancelBooking(b.id, b)}
                      className="btn btn-danger w-100"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;