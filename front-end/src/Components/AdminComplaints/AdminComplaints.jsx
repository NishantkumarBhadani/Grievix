import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, MessageSquare, ChevronDown, ChevronUp, CheckCircle, Loader2, AlertCircle, Clock } from "lucide-react";
import API_BASE_URL from "../../config/api.js";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.admin.token);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/complaint/allcomplaints`, {
        withCredentials: true,
      });
      setComplaints(res.data.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/complaint/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert("Failed to update status");
    }
  };

  const handleAddMessage = async (id) => {
    const message = messages[id];
    if (!message?.trim()) return alert("Please enter a message!");
    try {
      await axios.post(
        `${API_BASE_URL}/complaint/${id}/messages`,
        { message },
        { withCredentials: true }
      );
      setMessages((prev) => ({ ...prev, [id]: "" }));
      fetchComplaints();
    } catch (error) {
      console.error("Error adding message:", error.response?.data || error.message);
      alert("Failed to add message");
    }
  };

  const toggleExpand = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      in_progress: "bg-blue-100 text-blue-700 border-blue-300",
      resolved: "bg-green-100 text-green-700 border-green-300",
    };
    const icons = {
      pending: <Clock className="w-4 h-4 mr-1" />,
      in_progress: <Loader2 className="w-4 h-4 mr-1 animate-spin" />,
      resolved: <CheckCircle className="w-4 h-4 mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]} {status.replace("_", " ")}
      </span>
    );
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
            <p className="text-gray-600 mt-1">View, manage, and resolve user complaints effectively.</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "in_progress", label: "In Progress" },
            { key: "resolved", label: "Resolved" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                filterStatus === key
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No complaints found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredComplaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                        {complaint.subject || "No subject"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {complaint.user?.name || "Unknown"}
                      </div>
                    </div>
                    <button onClick={() => toggleExpand(complaint.id)} className="text-gray-500 hover:text-gray-700">
                      {expandedComplaint === complaint.id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>

                  {/* Status */}
                  <div className="px-5 py-3">{getStatusBadge(complaint.status)}</div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedComplaint === complaint.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 space-y-4 text-sm text-gray-700"
                      >
                        {complaint.description && (
                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="bg-gray-50 p-3 rounded-lg border">{complaint.description}</p>
                          </div>
                        )}

                        {/* Messages */}
                        {complaint.messages?.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-1">Messages</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {complaint.messages.map((m, i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded border text-sm">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      {m.sender === "admin" ? "You" : complaint.user?.name || "User"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(m.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="mt-1">{m.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image */}
                        {complaint.mediaUrl && (
                          <div className="relative border rounded-lg overflow-hidden">
                            <img
                              src={complaint.mediaUrl}
                              alt="Complaint Evidence"
                              className="w-full h-40 object-cover"
                              onClick={() => window.open(complaint.mediaUrl, "_blank")}
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              View Image
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer Actions */}
                  <div className="p-5 border-t space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Update Status</label>
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Send Message</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={messages[complaint.id] || ""}
                          onChange={(e) =>
                            setMessages((prev) => ({ ...prev, [complaint.id]: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === "Enter" && handleAddMessage(complaint.id)}
                        />
                        <button
                          onClick={() => handleAddMessage(complaint.id)}
                          disabled={!messages[complaint.id]?.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;
