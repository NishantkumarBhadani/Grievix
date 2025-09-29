import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config/api.js";
import axios from "axios";

function ComplaintStatus() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching status
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/complaint/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setStatus(res.data.data.status);
    } catch (error) {
      console.error("Error fetching status:", error.response?.data || error.message);
    }
  };

  // Fetching message
  const fetchMessage = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/complaint/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessage(res.data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchStatus();
      await fetchMessage();
      setLoading(false);
    };
    if (token) fetchData();
  }, [id, token]);

  if (loading) {
    return <p className="text-center mt-10">Loading Complaint details...</p>;
  }

  const steps = [
    { key: "pending", label: "Pending", color: "bg-red-500" },
    { key: "in_progress", label: "In Progress", color: "bg-yellow-500" },
    { key: "resolved", label: "Resolved", color: "bg-green-600" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-emerald-700 mb-8">
        Complaint Tracking
      </h2>

      {/* Horizontal Timeline */}
      <div className="flex items-center justify-between mb-10 relative">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center text-center">
              {/* Circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold z-10 ${
                  isCompleted ? step.color : "bg-gray-300"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-sm font-medium ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[12%] right-[12%] h-1 ${
                    index < currentStepIndex ? steps[index + 1].color : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Updates */}
      <h3 className="text-xl font-semibold text-emerald-700 mb-2">
        Admin Updates
      </h3>
      {message.length > 0 ? (
        <ul className="space-y-3">
          {message.map((msg, idx) => (
            <li
              key={idx}
              className="bg-emerald-50 border border-emerald-200 p-3 rounded-md text-gray-800"
            >
              📩 {msg.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No updates yet.</p>
      )}
    </div>
  );
}

export default ComplaintStatus;
