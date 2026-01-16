import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import roomsData from "../../data/roomsdata";

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    amenities: ""
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Fetch rooms from API
      const res = await api.get("/rooms");
      
      // Create a Map to combine hardcoded and API rooms
      const roomsMap = new Map();
      
      // Add hardcoded rooms first
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
      setRooms(combinedRooms);
      
    } catch (error) {
      console.error("Error fetching rooms from API:", error);
      
      // If API fails, use hardcoded data as fallback
      setRooms(roomsData);
      
      // Only log error if it's not a 404 (empty database is okay)
      if (error.response && error.response.status !== 404) {
        console.log("Using hardcoded room data as fallback");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, WEBP, AVIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      const base64 = await convertToBase64(file);
      setForm({ ...form, image: base64 });
      setImagePreview(base64);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.description) {
      toast.warning("Please fill all required fields");
      return;
    }

    // Convert amenities string to array
    const amenitiesArray = form.amenities
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== "");

    const roomData = {
      title: form.title,
      price: Number(form.price),
      description: form.description,
      image: form.image || "https://via.placeholder.com/400x250?text=No+Image",
      amenities: amenitiesArray
    };

    try {
      if (editId) {
        // UPDATE existing room
        await api.put(`/rooms/${editId}`, roomData);
        toast.success("Room updated successfully! 🎉");
      } else {
        // CREATE new room
        await api.post("/rooms", roomData);
        toast.success("Room added successfully! 🎉");
      }

      // Reset form
      setForm({ title: "", price: "", description: "", image: "", amenities: "" });
      setImagePreview("");
      setEditId(null);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Failed to save room. Please ensure JSON Server is running.");
    }
  };

  const deleteRoom = async (id) => {
    // Check if this is a hardcoded room (from roomsData)
    const isHardcodedRoom = roomsData.some(r => r.id === id);

    if (!window.confirm("Are you sure you want to permanently delete this room?")) {
      return;
    }

    try {
      if (isHardcodedRoom) {
        // For hardcoded rooms, mark as deleted in db.json
        const roomToDelete = rooms.find(r => r.id === id);
        await api.post("/rooms", {
          ...roomToDelete,
          id: id,
          deleted: true
        });
        toast.success("Room permanently deleted!");
      } else {
        // For custom rooms, delete from db.json
        await api.delete(`/rooms/${id}`);
        toast.success("Room deleted successfully!");
      }
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room. Please try again.");
    }
  };

  const editRoom = (room) => {
    setForm({
      title: room.title,
      price: room.price,
      description: room.description,
      image: room.image || "",
      amenities: room.amenities ? room.amenities.join(", ") : ""
    });
    setImagePreview(room.image || "");
    setEditId(room.id);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Editing room. Update the details below.");
  };

  const cancelEdit = () => {
    setForm({ title: "", price: "", description: "", image: "", amenities: "" });
    setImagePreview("");
    setEditId(null);
    toast.info("Edit cancelled");
  };

  const removeImage = () => {
    setForm({ ...form, image: "" });
    setImagePreview("");
    toast.info("Image removed");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Manage Rooms</h2>

      {/* Add/Edit Room Form */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{editId ? "Edit Room" : "Add New Room"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Room Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Deluxe Suite"
                  value={form.title}
                  required
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Price per Night (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g., 2999"
                  value={form.price}
                  required
                  min="0"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description *</label>
              <textarea
                className="form-control"
                placeholder="Describe the room features..."
                value={form.description}
                required
                rows="3"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Room Image *</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                onChange={handleImageChange}
                disabled={uploadingImage}
              />
              <small className="text-muted">
                Upload an image from your computer (JPG, PNG, WEBP, AVIF - Max 5MB)
              </small>
              {uploadingImage && (
                <div className="mt-2">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="text-muted">Uploading image...</span>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Or Enter Image URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={form.image.startsWith('data:') ? '' : form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                disabled={uploadingImage || form.image.startsWith('data:')}
              />
              <small className="text-muted">
                {form.image.startsWith('data:') 
                  ? "Image uploaded from computer. Remove it to use URL instead." 
                  : "Or paste an image URL from the internet"}
              </small>
            </div>

            {imagePreview && (
              <div className="mb-3">
                <label className="form-label fw-bold">Image Preview:</label>
                <div className="position-relative d-inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="img-thumbnail"
                    style={{ maxWidth: "300px", maxHeight: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=Invalid+Image";
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                    onClick={removeImage}
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">Amenities</label>
              <input
                type="text"
                className="form-control"
                placeholder="WiFi, AC, TV, Mini Bar (comma separated)"
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              />
              <small className="text-muted">Enter amenities separated by commas</small>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={uploadingImage}>
                {editId ? "Update Room" : "Add Room"}
              </button>
              {editId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Existing Rooms List */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">All Rooms ({rooms.length})</h5>
        </div>
        <div className="card-body">
          {rooms.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No rooms available</p>
              <p className="text-muted">Add your first room using the form above 👆</p>
            </div>
          ) : (
            <div className="row">
              {rooms.map((room) => {
                const isHardcodedRoom = roomsData.some(r => r.id === room.id);
                
                return (
                  <div key={room.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card h-100">
                      <img
                        src={room.image || "https://via.placeholder.com/400x250"}
                        className="card-img-top"
                        alt={room.title}
                        style={{ height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{room.title}</h5>
                        <p className="text-primary fw-bold">₹{room.price}/night</p>
                        <p className="card-text text-muted small">{room.description}</p>
                        
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mb-2">
                            {room.amenities.map((amenity, idx) => (
                              <span key={idx} className="badge bg-light text-dark me-1 mb-1">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-warning btn-sm flex-fill"
                            onClick={() => editRoom(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm flex-fill"
                            onClick={() => deleteRoom(room.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageRooms;