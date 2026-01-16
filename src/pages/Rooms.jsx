import { useState, useEffect } from "react";
import RoomCard from "../components/common/RoomCard";
import roomsData from "../data/roomsdata";
import api from "../services/api";
import Loader from "../components/common/Loader";

function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Fetch rooms from API
      const res = await api.get("/rooms");
      
      // Create a Map to combine hardcoded and API rooms
      const roomsMap = new Map();
      
      // Add hardcoded rooms first (with their IDs)
      roomsData.forEach(room => {
        roomsMap.set(room.id, room);
      });
      
      // Add/override with API rooms (they take priority)
      if (res.data && res.data.length > 0) {
        res.data.forEach(room => {
          // Skip deleted rooms
          if (room.deleted) {
            roomsMap.delete(room.id);
          } else {
            roomsMap.set(room.id, room);
          }
        });
      }
      
      // Convert map back to array
      const combinedRooms = Array.from(roomsMap.values());
      setAllRooms(combinedRooms);
      
    } catch (error) {
      console.error("Error fetching rooms from API:", error);
      
      // If API fails, use hardcoded data as fallback
      setAllRooms(roomsData);
      
      // Only log error if it's not a 404 (empty database is okay)
      if (error.response && error.response.status !== 404) {
        console.log("Using hardcoded room data as fallback");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on search and price
  const filteredRooms = allRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === "budget") matchesPrice = room.price < 150;
    else if (priceFilter === "moderate") matchesPrice = room.price >= 150 && room.price < 250;
    else if (priceFilter === "luxury") matchesPrice = room.price >= 250;

    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-light min-vh-100">
      <section id="rooms" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold">Our Rooms</h2>
            <p className="text-muted">
              Choose from our selection of premium rooms
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="row mb-4">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search rooms by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select form-select-lg"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Price Ranges</option>
                <option value="budget">Budget (Under ₹150)</option>
                <option value="moderate">Moderate (₹150 - ₹250)</option>
                <option value="luxury">Luxury (₹250+)</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-3">
            <p className="text-muted">
              Showing {filteredRooms.length} of {allRooms.length} rooms
            </p>
          </div>

          {/* Rooms Grid */}
          <div className="row">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  image={room.image}
                  title={room.title}
                  price={room.price}
                  description={room.description}
                  amenities={room.amenities || []}
                />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-muted">No rooms found matching your criteria</h4>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setSearchTerm("");
                    setPriceFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Rooms;