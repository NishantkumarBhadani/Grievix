// src/pages/admin/AdminReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import API_BASE_URL from "../../config/api.js";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16"];

function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/reports/summary`, { withCredentials: true });
      setSummary(res.data.data);
    } catch (err) {
      console.error("fetch summary error", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const downloadFile = async (type) => {
    try {
      setExporting(true);
      const url = `${API_BASE_URL}/admin/reports/export/${type}`;
      const res = await axios.get(url, {
        withCredentials: true,
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const link = document.createElement("a");
      const filename = res.headers["content-disposition"]?.split("filename=")[1] || `report.${type}`;
      link.href = window.URL.createObjectURL(blob);
      link.download = filename.replace(/["']/g, "");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("export error", err.response?.data || err.message);
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-500 mb-6">Unable to load report data at this time.</p>
          <button 
            onClick={fetchSummary}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = Object.entries(summary.byStatus || {}).map(([key, val]) => ({ 
    name: key.charAt(0).toUpperCase() + key.slice(1), 
    value: val 
  }));
  
  const barData = (summary.byDay || []).map(d => ({ 
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
    count: d.count 
  }));
  
  const submissionData = Object.entries(summary.bySubmissionType || {}).map(([k, v]) => ({ 
    name: k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '), 
    value: v 
  }));

  const reporterData = (summary.byReporter || []).slice(0, 8).map(reporter => ({
    ...reporter,
    shortName: reporter.name.length > 15 ? reporter.name.substring(0, 15) + '...' : reporter.name
  }));

  return (
    <div className="p-16 md:p-6 lg:p-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of complaint statistics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => downloadFile("csv")}
            disabled={exporting}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <span>📊</span>
                Export CSV
              </>
            )}
          </button>
          <button 
            onClick={() => downloadFile("pdf")}
            disabled={exporting}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <span>📄</span>
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {["overview", "analytics", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-1">Total Complaints</div>
          <div className="text-3xl font-bold text-blue-900">{summary.total?.toLocaleString() || 0}</div>
          <div className="text-xs text-blue-600 mt-2">All time records</div>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200">
          <div className="text-sm font-medium text-green-700 mb-1">This Month</div>
          <div className="text-3xl font-bold text-green-900">
            {barData.reduce((sum, day) => sum + day.count, 0)?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-green-600 mt-2">Last 30 days activity</div>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200">
          <div className="text-sm font-medium text-purple-700 mb-1">Active Reporters</div>
          <div className="text-3xl font-bold text-purple-900">{summary.byReporter?.length || 0}</div>
          <div className="text-xs text-purple-600 mt-2">Unique contributors</div>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200">
          <div className="text-sm font-medium text-amber-700 mb-1">Avg. Daily</div>
          <div className="text-3xl font-bold text-amber-900">
            {barData.length > 0 ? Math.round(barData.reduce((sum, day) => sum + day.count, 0) / barData.length) : 0}
          </div>
          <div className="text-xs text-amber-600 mt-2">Daily average</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Complaints Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Complaints Trend (Last 30 Days)</h3>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {barData.length} days data
            </div>
          </div>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Distribution</h3>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submission Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Submission Types</h3>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submissionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label
                >
                  {submissionData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Reporters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Top Reporters</h3>
            <div className="text-sm text-gray-500">
              Showing top {reporterData.length} reporters
            </div>
          </div>
          <div className="h-72 md:h-80">
            {reporterData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reporterData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis 
                    type="category" 
                    dataKey="shortName" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Complaints']}
                    labelFormatter={(value, payload) => payload?.[0]?.payload.name || value}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#10B981" 
                    radius={[0, 4, 4, 0]}
                    name="Complaints"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No reporter data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;