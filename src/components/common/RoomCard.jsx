import { useNavigate } from "react-router-dom";

function RoomCard({ id, image, title, price, description, amenities }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleBookNow = () => {
    if (!user) {
      alert("Please login first to book a room");
      navigate("/login");
    } else {
      // Navigate to booking page with pre-selected room data
      navigate("/booking", {
        state: { 
          roomId: id,
          roomTitle: title, 
          roomPrice: price,
          roomImage: image
        }
      });
    }
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm hover-card">
        <img
          src={image}
          className="card-img-top"
          alt={title}
          style={{ height: "250px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="text-primary fw-bold fs-4">₹{price} <small className="text-muted fs-6">/ night</small></p>
          <p className="text-muted">{description}</p>

          <div className="mb-3">
            {amenities.map((a, i) => (
              <span key={i} className="badge bg-light text-dark me-2 mb-2">
                {a}
              </span>
            ))}
          </div>

          <button
            className="btn btn-primary mt-auto"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;