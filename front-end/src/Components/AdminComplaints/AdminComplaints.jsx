import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
      console.error(
        "Error fetching complaints:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error adding message:",
        error.response?.data || error.message
      );
      alert("Failed to add message");
    }
  };

  const toggleExpand = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return "✅";
      case "in_progress":
        return "🔄";
      case "pending":
        return "⏳";
      default:
        return "📝";
    }
  };

  // Filter complaints based on status and search term
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch = complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen -mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 pt-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Complaint Management
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Manage and respond to user complaints efficiently
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="w-full lg:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Complaints" },
                { key: "pending", label: "Pending" },
                { key: "in_progress", label: "In Progress" },
                { key: "resolved", label: "Resolved" }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === key
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label} ({statusCounts[key]})
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Pending: {statusCounts.pending}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>In Progress: {statusCounts.in_progress}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Resolved: {statusCounts.resolved}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {complaints.length === 0 ? "No complaints found" : "No matching complaints"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {complaints.length === 0 
                ? "All complaints have been addressed or no complaints have been submitted yet."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {complaint.id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)} {complaint.status.replace("_", " ")}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpand(complaint.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                    >
                      {expandedComplaint === complaint.id ? '▲' : '▼'}
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-base mb-3">
                    {complaint.subject || "No subject provided"}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="mr-1">👤</span>
                      {complaint.user?.name || "Unknown User"}
                    </span>
                    {complaint.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Complaint Image */}
                {complaint.mediaUrl && (
                  <div className="relative border-b border-gray-100">
                    <img
                      src={complaint.mediaUrl}
                      alt="Complaint evidence"
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => window.open(complaint.mediaUrl, '_blank')}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      📷 View
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {expandedComplaint === complaint.id && (
                  <div className="p-5 bg-gray-50 border-t border-gray-200">
                    {/* Description */}
                    {complaint.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          {complaint.description}
                        </p>
                      </div>
                    )}

                    {/* Messages History */}
                    {complaint.messages && complaint.messages.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Message History:</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {complaint.messages.map((message, index) => (
                            <div
                              key={index}
                              className="text-sm bg-white p-2 rounded border"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  {message.sender === 'admin' ? 'You' : 'User'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{message.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="p-5 space-y-4 border-t border-gray-100">
                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status:
                    </label>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in_progress">🔄 In Progress</option>
                      <option value="resolved">✅ Resolved</option>
                    </select>
                  </div>

                  {/* Add Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send Message:
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your response..."
                        value={messages[complaint.id] || ""}
                        onChange={(e) =>
                          setMessages((prev) => ({ ...prev, [complaint.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddMessage(complaint.id)}
                      />
                      <button
                        onClick={() => handleAddMessage(complaint.id)}
                        disabled={!messages[complaint.id]?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;