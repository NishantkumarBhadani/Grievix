import React, { useEffect, useState } from 'react'
import ComplaintCard from '../../utils/ComplaintCard'
import axios from 'axios'
import API_BASE_URL from '../../config/api'
import { useSelector } from "react-redux"
import { Filter, Search, RefreshCw, AlertCircle, FileText } from 'lucide-react'

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const token = useSelector((state) => state.auth.token);

    // Status options for filtering
    const statusOptions = [
        { value: 'all', label: 'All Status', color: 'gray' },
        { value: 'pending', label: 'Pending', color: 'yellow' },
        { value: 'in_progress', label: 'In Progress', color: 'blue' },
        { value: 'resolved', label: 'Resolved', color: 'green' }
    ];

    // Complaints fetching
    const fetchComplaints = async () => {
        setRefreshing(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/complaint/mycomplaints`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            setComplaints(res.data.complaints || []);
        } catch (error) {
            console.log("Failed to fetch complaints:", error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    // Apply filters and search
    useEffect(() => {
        let filtered = complaints;

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(complaint => complaint.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(complaint =>
                complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.id?.toString().includes(searchTerm)
            );
        }

        setFilteredComplaints(filtered);
    }, [complaints, statusFilter, searchTerm]);

    useEffect(() => {
        if (token) {
            fetchComplaints();
        }
    }, [token])

    // Get status counts
    const getStatusCount = (status) => {
        return complaints.filter(complaint => complaint.status === status).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center min-h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                My Complaints
                            </h1>
                            <p className="text-gray-600">
                                Track and manage all your submitted complaints
                            </p>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchComplaints}
                            disabled={refreshing}
                            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {statusOptions.filter(opt => opt.value !== 'all').map((status) => (
                            <div
                                key={status.value}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {getStatusCount(status.value)}
                                        </p>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {status.label}
                                        </p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full bg-${status.color}-500`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search complaints by subject, description, or ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="sm:w-48">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaints List */}
                {filteredComplaints.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600">
                                Showing {filteredComplaints.length} of {complaints.length} complaints
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>

                        {filteredComplaints.map((complaint) => (
                            <ComplaintCard key={complaint.id} complaint={complaint} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        {complaints.length === 0 ? (
                            <>
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No complaints yet
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    You haven't submitted any complaints yet. When you do, they'll appear here for you to track.
                                </p>
                                <a
                                    href="/complaintForm"
                                    className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>Submit Your First Complaint</span>
                                </a>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No matching complaints found
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Try adjusting your search or filter criteria to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyComplaints