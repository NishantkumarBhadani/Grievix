import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Shield, Send, AlertCircle } from "lucide-react";
import API_BASE_URL from "../../config/api.js";

function EscalateComplaint() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [authorityName, setAuthorityName] = useState("");
  const [authorityEmail, setAuthorityEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Complaint Details
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/complaint/${complaintId}`, {
          withCredentials: true,
        });
        setComplaint(res.data.data);
      } catch (err) {
        setError("Failed to fetch complaint details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorityName || !authorityEmail || !reason) {
      return setError("All fields are required!");
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${API_BASE_URL}/complaint/${complaintId}/createscalate`,
        { authorityName, authorityEmail, reason },
        { withCredentials: true }
      );

      setSuccess("Complaint escalated successfully!");
      setTimeout(() => navigate("/admin/complaints"), 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to escalate complaint");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-400 mb-3" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Complaint not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" /> Escalate Complaint
          </h1>
        </div>

        {/* Complaint Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {complaint.subject}
          </h2>
          <p className="text-gray-700 mb-3">{complaint.description}</p>
          <div className="text-sm text-gray-600">
            <p>
              <b>User:</b> {complaint.user?.name || "Anonymous"}
            </p>
            <p>
              <b>Email:</b> {complaint.user?.email || "N/A"}
            </p>
            <p>
              <b>Status:</b> {complaint.status}
            </p>
          </div>
        </div>

        {/* Escalation Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authority Name
            </label>
            <input
              type="text"
              value={authorityName}
              onChange={(e) => setAuthorityName(e.target.value)}
              placeholder="Enter authority name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authority Email
            </label>
            <input
              type="email"
              value={authorityEmail}
              onChange={(e) => setAuthorityEmail(e.target.value)}
              placeholder="Enter authority email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Escalation
            </label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for escalation"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
              {success}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Escalating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Escalate Complaint
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

export default EscalateComplaint;
