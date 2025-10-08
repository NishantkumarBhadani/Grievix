import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { useSelector } from "react-redux";
import {
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Eye,
  MessageSquare,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const fetchComplaints = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/complaint/allcomplaints`, {
        withCredentials: true,
      });
      setComplaints(res.data.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter logic
  const filteredComplaints = complaints.filter((c) => {
    if (timeRange === "all") return true;
    const created = new Date(c.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return timeRange === "week" ? diffDays <= 7 : diffDays <= 30;
  });

  const totalComplaints = filteredComplaints.length;
  const resolved = filteredComplaints.filter((c) => c.status === "resolved").length;
  const pending = filteredComplaints.filter((c) => c.status === "pending").length;
  const inProgress = filteredComplaints.filter((c) => c.status === "in_progress").length;

  const resolutionRate = totalComplaints
    ? ((resolved / totalComplaints) * 100).toFixed(1)
    : 0;

  const avgResolutionTime = (() => {
    const resolvedOnes = filteredComplaints.filter(
      (c) => c.status === "resolved" && c.createdAt && c.updatedAt
    );
    if (!resolvedOnes.length) return 0;
    const totalDays = resolvedOnes.reduce((acc, c) => {
      const created = new Date(c.createdAt);
      const updated = new Date(c.updatedAt);
      return acc + (updated - created) / (1000 * 60 * 60 * 24);
    }, 0);
    return (totalDays / resolvedOnes.length).toFixed(1);
  })();

  const recent = [...filteredComplaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const chartData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of complaints and activity insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Time</option>
              <option value="month">Last 30 Days</option>
              <option value="week">Last 7 Days</option>
            </select>
            <button
              onClick={fetchComplaints}
              disabled={refreshing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Complaints", value: totalComplaints, icon: BarChart3, color: "blue" },
            { title: "Pending", value: pending, icon: Clock, color: "yellow" },
            { title: "In Progress", value: inProgress, icon: AlertCircle, color: "purple" },
            { title: "Resolved", value: resolved, icon: CheckCircle, color: "green", extra: `${resolutionRate}% rate` },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${item.color}-100`}>
                  <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-gray-600 text-sm">
                {item.extra || item.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-gray-700">Avg. Resolution</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgResolutionTime} days</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-gray-700">Resolution Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{resolutionRate}%</p>
            </div>
          </div>
        </div>

        {/* Recent + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Complaints */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Complaints
              </h3>
              <button
                onClick={() => navigate("/admin/complaints")}
                className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 text-sm font-medium"
              >
                <span>View All</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              {recent.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No complaints found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent.map((c) => (
                    <motion.div
                      key={c.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/complaints/${c.id}`)}
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {c.subject || `Complaint #${c.id}`}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{c.user?.name || "Unknown User"}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          c.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : c.status === "in_progress"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Manage Complaints",
                  icon: MessageSquare,
                  color: "emerald",
                  link: "/admin/complaints",
                },
                {
                  label: "User Management",
                  icon: Users,
                  color: "blue",
                  link: "/admin/users",
                },
                {
                  label: "View Analytics",
                  icon: BarChart3,
                  color: "purple",
                  link: "/admin/analytics",
                },
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(btn.link)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-left transition-all"
                >
                  <btn.icon className={`h-5 w-5 text-${btn.color}-600`} />
                  <span className="font-medium text-gray-700">{btn.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
