import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  Send,
  Image,
  Shield,
  RefreshCw,
} from "lucide-react";
import API_BASE_URL from "../../config/api.js";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.admin.token);
  const navigate = useNavigate();

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE_URL}/complaint/allcomplaints`, {
        withCredentials: true,
      });
      setComplaints(res.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching complaints:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle complaint status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/complaint/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchComplaints();
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      alert("Failed to update status");
    }
  };

  // Add a message to complaint
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
      console.error(
        "Error adding message:",
        error.response?.data || error.message
      );
      alert("Failed to add message");
    }
  };

  // Expand/Collapse complaint
  const toggleExpand = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  // Status badge UI
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      in_progress: "bg-blue-50 text-blue-700 border-blue-200",
      resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      in_progress: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
      resolved: <CheckCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]} {status.replace("_", " ")}
      </span>
    );
  };

  // Filter logic
  const getStatusCount = (status) => {
    return complaints.filter((c) =>
      status === "all" ? true : c.status === status
    ).length;
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch =
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complaint Center</h1>
          </div>
          <p className="text-gray-600">
            Manage and resolve user complaints efficiently
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: getStatusCount("all") },
                { key: "pending", label: "Pending", count: getStatusCount("pending") },
                { key: "in_progress", label: "In Progress", count: getStatusCount("in_progress") },
                { key: "resolved", label: "Resolved", count: getStatusCount("resolved") },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    filterStatus === key
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      filterStatus === key
                        ? "bg-white text-emerald-500"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Refresh */}
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
              <button
                onClick={fetchComplaints}
                disabled={refreshing}
                className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No complaints found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All complaints are resolved! Great work!"}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredComplaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpand(complaint.id)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                          {complaint.subject || "No subject"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4" />
                          <span className="truncate">
                            {complaint.user?.name || "Unknown User"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(complaint.status)}
                          <span className="text-xs text-gray-500">
                            {new Date(
                              complaint.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                        {expandedComplaint === complaint.id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedComplaint === complaint.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t"
                      >
                        <div className="p-5 space-y-4">
                          {/* Description */}
                          {complaint.description && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Description
                              </h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border text-sm leading-relaxed">
                                {complaint.description}
                              </p>
                            </div>
                          )}

                          {/* Image */}
                          {complaint.mediaUrl && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Attachment
                              </h4>
                              <div
                                className="relative border rounded-xl overflow-hidden cursor-pointer group"
                                onClick={() =>
                                  window.open(complaint.mediaUrl, "_blank")
                                }
                              >
                                <img
                                  src={complaint.mediaUrl}
                                  alt="Complaint evidence"
                                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                  <Image className="w-3 h-3" />
                                  View Image
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Messages */}
                          {complaint.messages?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Conversation
                              </h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {complaint.messages.map((m, i) => (
                                  <div
                                    key={i}
                                    className={`p-3 rounded-xl text-sm ${
                                      m.sender === "admin"
                                        ? "bg-emerald-50 border border-emerald-100 ml-4"
                                        : "bg-gray-50 border border-gray-100 mr-4"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span
                                        className={`font-semibold ${
                                          m.sender === "admin"
                                            ? "text-emerald-700"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {m.sender === "admin"
                                          ? "You"
                                          : complaint.user?.name || "User"}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(m.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{m.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="p-5 border-t bg-gray-50 space-y-4">
                          {/* Status Update */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Status
                            </label>
                            <select
                              value={complaint.status}
                              onChange={(e) =>
                                handleStatusChange(complaint.id, e.target.value)
                              }
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>

                          {/* Send Message */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Send Response
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Type your response..."
                                value={messages[complaint.id] || ""}
                                onChange={(e) =>
                                  setMessages((prev) => ({
                                    ...prev,
                                    [complaint.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                onKeyPress={(e) =>
                                  e.key === "Enter" &&
                                  handleAddMessage(complaint.id)
                                }
                              />
                              <button
                                onClick={() => handleAddMessage(complaint.id)}
                                disabled={!messages[complaint.id]?.trim()}
                                className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Escalate Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/complaint/${complaint.id}/escalate`
                                )
                              }
                              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-sm"
                            >
                              <Shield className="w-4 h-4" />
                              Escalate
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
