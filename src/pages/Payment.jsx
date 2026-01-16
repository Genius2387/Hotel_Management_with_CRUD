import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader";
import { toast } from "react-toastify";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  if (!state) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h3>Invalid Payment Access</h3>
          <p>Please make a booking first</p>
          <button className="btn btn-primary" onClick={() => navigate("/booking")}>
            Go to Booking
          </button>
        </div>
      </div>
    );
  }

  const confirmPayment = async () => {
    setLoading(true);
    
    try {
      await api.patch(`/bookings/${state.id}`, {
        status: "confirmed",
        paymentMethod: paymentMethod,
        paidAt: new Date().toISOString()
      });

      toast.success("Payment Successful! Your booking is confirmed. 🎉");
      
      // Delay navigation slightly to show toast
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1000);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">Payment Gateway</h2>
            </div>
            <div className="card-body p-4">
              {/* Booking Details */}
              <div className="mb-4">
                <h4 className="mb-3">Booking Details</h4>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Guest Name:</td>
                        <td>{state.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Phone:</td>
                        <td>{state.phone}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Room:</td>
                        <td>{state.room}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Check-in:</td>
                        <td>{new Date(state.fromDate).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Check-out:</td>
                        <td>{new Date(state.toDate).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Number of Guests:</td>
                        <td>{state.guests}</td>
                      </tr>
                      {state.specialRequests && (
                        <tr>
                          <td className="fw-bold">Special Requests:</td>
                          <td>{state.specialRequests}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <hr />

              {/* Price Breakdown */}
              <div className="mb-4">
                <h4 className="mb-3">Price Breakdown</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Price per night:</span>
                  <span>₹{state.pricePerNight || state.price}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Number of nights:</span>
                  <span>{state.numberOfNights || 1}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <h5>Total Amount:</h5>
                  <h5 className="text-success">₹{state.totalPrice || state.price}</h5>
                </div>
              </div>

              <hr />

              {/* Payment Method Selection */}
              <div className="mb-4">
                <h4 className="mb-3">Select Payment Method</h4>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="card">
                    💳 Credit/Debit Card
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="upi">
                    📱 UPI Payment
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="netbanking"
                    value="netbanking"
                    checked={paymentMethod === "netbanking"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="netbanking">
                    🏦 Net Banking
                  </label>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> This is a demo payment gateway. 
                  Your booking will be confirmed after clicking "Pay & Confirm".
                </small>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button
                  className="btn btn-success btn-lg"
                  onClick={confirmPayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${state.totalPrice || state.price} & Confirm`}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Back to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;