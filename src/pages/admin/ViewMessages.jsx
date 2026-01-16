import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/messages");
      // Sort by date (newest first)
      const sortedMessages = res.data.sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Make sure JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/messages/${id}`, { 
        status: "read",
        readAt: new Date().toISOString()
      });
      fetchMessages();
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update message");
    }
  };

  const markAsUnread = async (id) => {
    try {
      await api.patch(`/messages/${id}`, { 
        status: "unread",
        readAt: null
      });
      fetchMessages();
      toast.success("Message marked as unread");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update message");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await api.delete(`/messages/${id}`);
      toast.success("Message deleted successfully");
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete message");
    }
  };

  const getStatusBadge = (status) => {
    return status === "read" ? "bg-success" : "bg-warning text-dark";
  };

  const filteredMessages = messages.filter(msg => {
    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    const matchesSearch = 
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const readCount = messages.filter(m => m.status === "read").length;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📬 Contact Messages</h2>
        <button 
          className="btn btn-primary"
          onClick={fetchMessages}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary mb-0">{messages.length}</h3>
              <small className="text-muted">Total Messages</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-warning mb-0">{unreadCount}</h3>
              <small className="text-muted">Unread Messages</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success mb-0">{readCount}</h3>
              <small className="text-muted">Read Messages</small>
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
            placeholder="🔍 Search by name, email, subject, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select form-select-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="unread">⚠️ Unread Only</option>
            <option value="read">✅ Read Only</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted mb-3">
        <strong>Showing {filteredMessages.length} of {messages.length} messages</strong>
      </p>

      {filteredMessages.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>📭 No messages found</h5>
          <p className="mb-0">
            {messages.length === 0 
              ? "No contact messages received yet." 
              : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <div className="row">
          {/* Messages List */}
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h6 className="mb-0">Messages Inbox</h6>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {filteredMessages.map(msg => (
                  <button
                    key={msg.id}
                    className={`list-group-item list-group-item-action ${
                      selectedMessage?.id === msg.id ? 'active' : ''
                    } ${msg.status === 'unread' ? 'border-start border-warning border-3' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') {
                        markAsRead(msg.id);
                      }
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="mb-0 fw-bold">{msg.name}</h6>
                          <span className={`badge ${getStatusBadge(msg.status)}`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="mb-1 small text-muted">{msg.email}</p>
                        <p className="mb-1 fw-semibold small">
                          {msg.subject || "No subject"}
                        </p>
                        <p className="mb-1 small text-truncate">
                          {msg.message.substring(0, 60)}...
                        </p>
                        <small className="text-muted">
                          {new Date(msg.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="col-md-7">
            {selectedMessage ? (
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Message Details</h6>
                  <div className="btn-group btn-group-sm">
                    {selectedMessage.status === "unread" ? (
                      <button 
                        className="btn btn-light btn-sm"
                        onClick={() => markAsRead(selectedMessage.id)}
                      >
                        ✓ Mark as Read
                      </button>
                    ) : (
                      <button 
                        className="btn btn-light btn-sm"
                        onClick={() => markAsUnread(selectedMessage.id)}
                      >
                        ✉️ Mark as Unread
                      </button>
                    )}
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>From:</strong>
                    <p className="mb-0">{selectedMessage.name}</p>
                  </div>

                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p className="mb-0">
                      <a href={`mailto:${selectedMessage.email}`}>
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>Subject:</strong>
                    <p className="mb-0">{selectedMessage.subject || "No subject"}</p>
                  </div>

                  <div className="mb-3">
                    <strong>Received:</strong>
                    <p className="mb-0">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {selectedMessage.readAt && (
                    <div className="mb-3">
                      <strong>Read At:</strong>
                      <p className="mb-0 text-success">
                        {new Date(selectedMessage.readAt).toLocaleString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  <hr />

                  <div className="mb-3">
                    <strong>Message:</strong>
                    <div className="alert alert-light mt-2">
                      <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div className="d-grid gap-2">
                    <a 
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                      className="btn btn-primary"
                    >
                      📧 Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <span style={{ fontSize: "4rem" }}>📬</span>
                  <h5 className="text-muted mt-3">Select a message to view details</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMessages;