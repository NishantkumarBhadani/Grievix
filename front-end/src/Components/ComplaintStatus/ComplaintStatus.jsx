import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config/api.js";
import axios from "axios";
import { 
  Clock, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Calendar,
  User,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ComplaintStatus() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch complaint details and messages
  const fetchComplaintData = async () => {
    setRefreshing(true);
    try {
      // Fetch complaint details
      const [statusRes, messagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/complaint/${id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${API_BASE_URL}/complaint/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
      ]);

      setComplaint(statusRes.data.data);
      setMessages(messagesRes.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching complaint data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchComplaintData();
    }
  }, [id, token]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!loading && token) {
      const interval = setInterval(fetchComplaintData, 30000);
      return () => clearInterval(interval);
    }
  }, [loading, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { 
      key: "pending", 
      label: "Pending Review", 
      description: "Your complaint has been submitted and is awaiting review",
      color: "bg-yellow-500",
      icon: Clock
    },
    { 
      key: "in_progress", 
      label: "In Progress", 
      description: "We're currently working on resolving your complaint",
      color: "bg-blue-500",
      icon: Settings
    },
    { 
      key: "resolved", 
      label: "Resolved", 
      description: "Your complaint has been successfully resolved",
      color: "bg-green-500",
      icon: CheckCircle
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === complaint?.status);

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "text-green-600 bg-green-50 border-green-200";
      case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Complaints</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Complaint Tracking
              </h1>
              <p className="text-gray-600">
                Track the progress of your complaint in real-time
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Updated {formatDate(lastUpdated)}
                </p>
              )}
              <button
                onClick={fetchComplaintData}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {complaint?.subject || "Complaint Details"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {complaint?.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint?.status)}`}>
                  {complaint?.status?.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>ID: {id}</span>
                </div>
                {complaint?.createdAt && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {formatDate(complaint.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span>Progress Timeline</span>
              </h3>

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="flex space-x-4">
                      {/* Timeline line and dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          isCompleted ? step.color : 'bg-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-0.5 h-full ${
                            isCompleted ? step.color : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-6 ${index < steps.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-semibold ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Messages */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <span>Admin Updates</span>
              </h3>

              {messages.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm leading-relaxed">
                            {msg.message}
                          </p>
                          {msg.timestamp && (
                            <p className="text-gray-500 text-xs mt-2">
                              {formatDate(msg.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No updates from admin yet. Check back later for progress updates.
                  </p>
                </div>
              )}

              {/* Help Text */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">
                  💡 This page updates automatically every 30 seconds. You'll see admin responses and status updates here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintStatus;