import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader";
import { toast } from "react-toastify";
import roomsData from "../data/roomsdata";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Get pre-selected room data from navigation state
  const preSelectedRoom = location.state?.roomTitle || "";

  const [form, setForm] = useState({
    name: user?.name || "",
    room: preSelectedRoom,
    fromDate: "",
    toDate: "",
    guests: 1,
    phone: "",
    specialRequests: ""
  });

  // Fetch available rooms on component mount
  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    setRoomsLoading(true);
    try {
      // Fetch rooms from API
      const res = await api.get("/rooms");
      
      // Create a Map to combine hardcoded and API rooms
      const roomsMap = new Map();
      
      // Add hardcoded rooms first (as fallback)
      roomsData.forEach(room => {
        roomsMap.set(room.title, { 
          title: room.title, 
          price: room.price,
          id: room.id 
        });
      });
      
      // Add/override with API rooms (they take priority)
      if (res.data && res.data.length > 0) {
        res.data.forEach(room => {
          roomsMap.set(room.title, { 
            title: room.title, 
            price: room.price,
            id: room.id 
          });
        });
      }
      
      // Convert map to array and set state
      const combinedRooms = Array.from(roomsMap.values());
      setAvailableRooms(combinedRooms);
      
    } catch (error) {
      console.error("Error fetching rooms from API:", error);
      
      // Use hardcoded rooms as fallback
      const fallbackRooms = roomsData.map(r => ({ 
        title: r.title, 
        price: r.price,
        id: r.id 
      }));
      setAvailableRooms(fallbackRooms);
      
      // Only show toast if it's a real error (not just empty database)
      if (error.response && error.response.status !== 404) {
        toast.info("Using default room list");
      }
    } finally {
      setRoomsLoading(false);
    }
  };

  // Calculate price when dates or room changes
  useEffect(() => {
    if (form.fromDate && form.toDate && form.room) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setNumberOfNights(nights);
        
        // Find the selected room and get its price
        const selectedRoom = availableRooms.find(r => r.title === form.room);
        const pricePerNight = selectedRoom ? selectedRoom.price : 0;
        
        setTotalPrice(pricePerNight * nights);
      } else {
        setNumberOfNights(0);
        setTotalPrice(0);
      }
    }
  }, [form.fromDate, form.toDate, form.room, availableRooms]);

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);

    if (from < today) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }

    if (to <= from) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    if (!form.room) {
      toast.warning("Please select a room");
      return;
    }

    if (!validateDates()) {
      return;
    }

    setLoading(true);

    try {
      // Find the selected room to get accurate price
      const selectedRoom = availableRooms.find(r => r.title === form.room);
      const pricePerNight = selectedRoom ? selectedRoom.price : 0;

      const bookingData = {
        userId: user.id,
        name: form.name,
        room: form.room,
        fromDate: form.fromDate,
        toDate: form.toDate,
        guests: form.guests,
        phone: form.phone,
        specialRequests: form.specialRequests,
        pricePerNight: pricePerNight,
        numberOfNights: numberOfNights,
        totalPrice: totalPrice,
        status: "pending",
        bookedAt: new Date().toISOString()
      };

      const response = await api.post("/bookings", bookingData);

      toast.success("Booking created successfully! Redirecting to payment 💳");

      // Small delay before navigation for user to see success message
      setTimeout(() => {
        navigate("/payment", {
          state: response.data
        });
      }, 500);

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Please ensure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get current room price
  const getCurrentRoomPrice = () => {
    const selectedRoom = availableRooms.find(r => r.title === form.room);
    return selectedRoom ? selectedRoom.price : 0;
  };

  if (roomsLoading) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Book Your Room</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Guest Name */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Guest Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    required
                    pattern="[0-9]{10}"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <small className="text-muted">10 digit phone number</small>
                </div>

                {/* Room Selection - Dynamic from API */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Select Room *</label>
                  <select
                    className="form-select form-select-lg"
                    value={form.room}
                    required
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                  >
                    <option value="">Choose a room...</option>
                    {availableRooms.map((room, index) => (
                      <option key={index} value={room.title}>
                        {room.title} - ₹{room.price}/night
                      </option>
                    ))}
                  </select>
                  {availableRooms.length === 0 && (
                    <small className="text-danger">
                      No rooms available. Please contact admin.
                    </small>
                  )}
                </div>

                {/* Date Selection */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Check-in Date *</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      min={getTodayDate()}
                      value={form.fromDate}
                      required
                      onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Check-out Date *</label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      min={form.fromDate || getTodayDate()}
                      value={form.toDate}
                      required
                      onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Number of Guests *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control form-control-lg"
                    placeholder="Number of Guests"
                    value={form.guests}
                    required
                    onChange={(e) =>
                      setForm({ ...form, guests: Number(e.target.value) })
                    }
                  />
                </div>

                {/* Special Requests */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Special Requests (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Any special requirements or requests..."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  />
                </div>

                {/* Price Summary */}
                {numberOfNights > 0 && totalPrice > 0 && form.room && (
                  <div className="alert alert-info">
                    <h5 className="alert-heading">Booking Summary</h5>
                    <hr />
                    <p className="mb-1"><strong>Room:</strong> {form.room}</p>
                    <p className="mb-1"><strong>Price per night:</strong> ₹{getCurrentRoomPrice()}</p>
                    <p className="mb-1"><strong>Number of nights:</strong> {numberOfNights}</p>
                    <h4 className="mt-3 text-primary"><strong>Total Price: ₹{totalPrice}</strong></h4>
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading || availableRooms.length === 0}
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/rooms")}
                  >
                    Back to Rooms
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;