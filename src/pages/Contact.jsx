import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Save message to database
      await api.post("/messages", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "No subject",
        message: formData.message,
        status: "unread",
        createdAt: new Date().toISOString()
      });

      toast.success('Message sent successfully! We will get back to you soon. 📧');
      
      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center display-5 fw-bold mb-5">Contact Us</h2>
        
        <div className="row g-4">
          {/* Contact Information */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4 className="mb-4">Get in Touch</h4>
                
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-start">
                    <div 
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "10px",
                        flexShrink: 0
                      }}
                    >
                      <span className="text-white fs-4">📍</span>
                    </div>
                    <div>
                      <h5 className="text-primary mb-2">Address</h5>
                      <p className="text-muted mb-0">123 Grand Avenue, City Center<br/>Pune, Maharashtra 411001</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div 
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "10px",
                        flexShrink: 0
                      }}
                    >
                      <span className="text-white fs-4">📞</span>
                    </div>
                    <div>
                      <h5 className="text-primary mb-2">Phone</h5>
                      <p className="text-muted mb-0">+91 8805324590</p>
                      <small className="text-muted">Mon-Sun: 9:00 AM - 9:00 PM</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div 
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "10px",
                        flexShrink: 0
                      }}
                    >
                      <span className="text-white fs-4">📧</span>
                    </div>
                    <div>
                      <h5 className="text-primary mb-2">Email</h5>
                      <p className="text-muted mb-0">info@oceanviewhotel.com</p>
                      <small className="text-muted">We reply within 24 hours</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div 
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "10px",
                        flexShrink: 0
                      }}
                    >
                      <span className="text-white fs-4">🕐</span>
                    </div>
                    <div>
                      <h5 className="text-primary mb-2">Business Hours</h5>
                      <p className="text-muted mb-0">24/7 Front Desk Service</p>
                      <small className="text-muted">Check-in: 2:00 PM | Check-out: 11:00 AM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h4 className="mb-4">Send us a Message</h4>
                
                <form onSubmit={handleSend}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Name *</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      placeholder="Enter your name"
                      value={formData.name}
                      required
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Email *</label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg" 
                      placeholder="Enter your email"
                      value={formData.email}
                      required
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Subject</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      placeholder="Subject (Optional)"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Message *</label>
                    <textarea 
                      className="form-control form-control-lg" 
                      placeholder="Type your message here..."
                      rows="5"
                      value={formData.message}
                      required
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn btn-lg text-white w-100" 
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        📨 Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;