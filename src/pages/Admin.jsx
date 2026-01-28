import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Admin = () => {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [userPage, setUserPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [txnPage, setTxnPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [txnStatus, setTxnStatus] = useState("");
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalEventPages, setTotalEventPages] = useState(1);
  const [totalTxnPages, setTotalTxnPages] = useState(1);

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!isLoggedIn || role !== "admin") {
    nav("/login");
    return null;
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "events") fetchEvents();
    if (activeTab === "transactions") fetchTransactions();
  }, [activeTab, userPage, userSearch, eventPage, eventStatus, txnPage, txnStatus]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, statsRes] = await Promise.all([
        axios.get("https://event-hub-backend-uzcs.onrender.com/api/admin/dashboard", { headers }),
        axios.get("https://event-hub-backend-uzcs.onrender.com/api/admin/reports/stats", { headers }),
      ]);

      setOverview(dashboardRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/users?page=${userPage}&limit=10&search=${userSearch}`,
        { headers }
      );
      setUsers(res.data.data);
      setTotalUserPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/events?page=${eventPage}&limit=10${
          eventStatus ? `&status=${eventStatus}` : ""
        }`,
        { headers }
      );
      setEvents(res.data.data);
      setTotalEventPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/transactions?page=${txnPage}&limit=10${
          txnStatus ? `&status=${txnStatus}` : ""
        }`,
        { headers }
      );
      setTransactions(res.data.data);
      setTotalTxnPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await axios.patch(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/users/${userId}/status`,
        { status: newStatus },
        { headers }
      );
      toast.success(`User ${newStatus}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://event-hub-backend-uzcs.onrender.com/api/admin/users/${userId}`, {
        headers,
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const approveEvent = async (eventId) => {
    try {
      await axios.put(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/events/${eventId}/status`,
        { status: "approved" },
        { headers }
      );
      toast.success("Event approved");
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`https://event-hub-backend-uzcs.onrender.com/api/admin/events/${eventId}`, {
        headers,
      });
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const processRefund = async (txnId) => {
    if (!window.confirm("Are you sure you want to process this refund?"))
      return;
    try {
      await axios.patch(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/transactions/${txnId}/refund`,
        {},
        { headers }
      );
      toast.success("Refund processed successfully");
      fetchTransactions();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium mb-2">{label}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "users", label: "👥 Users", icon: "👥" },
    { id: "events", label: "🎪 Events", icon: "🎪" },
    { id: "transactions", label: "💳 Transactions", icon: "💳" },
    { id: "reports", label: "📈 Reports", icon: "📈" },
  ];

  if (loading && activeTab === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-gray-400 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Complete platform management</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("userName");
              nav("/login");
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:scale-105 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overview && (
                <>
                  <StatCard
                    icon="👥"
                    label="Total Users"
                    value={overview.totalUsers}
                    color="bg-blue-500/20 text-blue-400"
                  />
                  <StatCard
                    icon="🎪"
                    label="Total Events"
                    value={overview.totalEvents}
                    color="bg-pink-500/20 text-pink-400"
                  />
                  <StatCard
                    icon="🎫"
                    label="Total Tickets"
                    value={overview.totalTickets}
                    color="bg-green-500/20 text-green-400"
                  />
                  <StatCard
                    icon="💰"
                    label="Total Revenue"
                    value={`₹${(overview.totalRevenue || 0).toLocaleString()}`}
                    color="bg-yellow-500/20 text-yellow-400"
                  />
                </>
              )}
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {overview && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                      Events Status
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Approved</span>
                          <span className="text-green-400 font-semibold">
                            {overview.approvedEvents}
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                overview.totalEvents > 0
                                  ? (overview.approvedEvents /
                                      overview.totalEvents) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Pending</span>
                          <span className="text-yellow-400 font-semibold">
                            {overview.pendingEvents}
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                overview.totalEvents > 0
                                  ? (overview.pendingEvents /
                                      overview.totalEvents) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                      Ticket Success Rate
                    </h2>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-purple-400 font-semibold">
                        {overview.totalTickets > 0
                          ? (
                              (overview.successfulTickets /
                                overview.totalTickets) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full"
                        style={{
                          width: `${
                            overview.totalTickets > 0
                              ? (overview.successfulTickets /
                                  overview.totalTickets) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              {stats && (
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Platform Statistics
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Total Users</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Active Events</p>
                      <p className="text-2xl font-bold text-green-400">
                        {stats.activeEvents}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">
                        Total Tickets
                      </p>
                      <p className="text-2xl font-bold text-purple-400">
                        {stats.totalTickets}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">
                        Pending Events
                      </p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {stats.pendingEvents}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Total Events</p>
                      <p className="text-2xl font-bold text-pink-400">
                        {stats.totalEvents}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                      <p className="text-xl font-bold text-orange-400">
                        ₹{(stats.totalRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Email
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Role
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Joined
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-4 text-white font-medium text-sm">
                        {user.name}
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {user.email}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : user.role === "organizer"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition text-xs font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            toggleUserStatus(user._id, user.status)
                          }
                          className={`px-3 py-1 rounded hover:opacity-80 transition text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalUserPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalUserPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setUserPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      userPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <label className="text-gray-400 font-semibold text-sm">Filter by Status:</label>
              <select
                value={eventStatus}
                onChange={(e) => {
                  setEventStatus(e.target.value);
                  setEventPage(1);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400 hover:border-purple-400/70 transition font-semibold"
              >
                <option value="" className="bg-[#1a1a24]">All Status</option>
                <option value="pending" className="bg-[#1a1a24]">Pending</option>
                <option value="approved" className="bg-[#1a1a24]">Approved</option>
                <option value="rejected" className="bg-[#1a1a24]">Rejected</option>
                <option value="suspended" className="bg-[#1a1a24]">Suspended</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Event Title
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Organizer
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-4 text-white font-medium text-sm">
                        {event.eventtitle}
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {event.user?.name || "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : event.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : event.status === "suspended"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition text-xs font-semibold"
                        >
                          View
                        </button>
                        {(event.status === "pending" || event.status === "approve") && (
                          <button
                            onClick={() => approveEvent(event._id)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition text-xs font-semibold"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {(event.status === "pending" || event.status === "approve") && (
                          <button
                            onClick={async () => {
                              if (!window.confirm("Are you sure you want to reject this event?")) return;
                              try {
                                await axios.put(
                                  `https://event-hub-backend-uzcs.onrender.com/api/admin/events/${event._id}/status`,
                                  { status: "rejected" },
                                  { headers }
                                );
                                toast.success("Event rejected");
                                fetchEvents();
                              } catch (error) {
                                console.error("Error rejecting event:", error);
                                toast.error("Failed to reject event");
                              }
                            }}
                            className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition text-xs font-semibold"
                          >
                            ✕ Reject
                          </button>
                        )}
                        {event.status !== "suspended" && (
                          <button
                            onClick={async () => {
                              if (!window.confirm("Are you sure you want to suspend this event?")) return;
                              try {
                                await axios.put(
                                  `https://event-hub-backend-uzcs.onrender.com/api/admin/events/${event._id}/status`,
                                  { status: "suspended" },
                                  { headers }
                                );
                                toast.success("Event suspended");
                                fetchEvents();
                              } catch (error) {
                                console.error("Error suspending event:", error);
                                toast.error("Failed to suspend event");
                              }
                            }}
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition text-xs font-semibold"
                          >
                            ⏸ Suspend
                          </button>
                        )}
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalEventPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalEventPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setEventPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      eventPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <label className="text-gray-400 font-semibold text-sm">Filter by Status:</label>
              <select
                value={txnStatus}
                onChange={(e) => {
                  setTxnStatus(e.target.value);
                  setTxnPage(1);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400 hover:border-purple-400/70 transition font-semibold"
              >
                <option value="" className="bg-[#1a1a24]">All Status</option>
                <option value="success" className="bg-[#1a1a24]">Success</option>
                <option value="pending" className="bg-[#1a1a24]">Pending</option>
                <option value="failed" className="bg-[#1a1a24]">Failed</option>
                <option value="refunded" className="bg-[#1a1a24]">Refunded</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      User
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Event
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-4 text-white font-medium text-sm">
                        {txn.user?.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {txn.event?.eventtitle || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-white font-semibold text-sm">
                        ₹{txn.amount}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            txn.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : txn.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : txn.status === "refunded"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition text-xs font-semibold"
                        >
                          View
                        </button>
                        {txn.status === "success" && (
                          <button
                            onClick={() => processRefund(txn._id)}
                            className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition text-xs font-semibold"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalTxnPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalTxnPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTxnPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      txnPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats && (
                <>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Total Users</p>
                    <p className="text-4xl font-bold text-blue-400">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Active Events</p>
                    <p className="text-4xl font-bold text-green-400">
                      {stats.activeEvents}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Total Tickets</p>
                    <p className="text-4xl font-bold text-purple-400">
                      {stats.totalTickets}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Pending Events</p>
                    <p className="text-4xl font-bold text-yellow-400">
                      {stats.pendingEvents}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Total Events</p>
                    <p className="text-4xl font-bold text-pink-400">
                      {stats.totalEvents}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-3">Total Revenue</p>
                    <p className="text-3xl font-bold text-orange-400">
                      ₹{(stats.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Platform Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Key Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">User Growth</span>
                      <span className="text-green-400 font-semibold">
                        Healthy
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event Approval Rate</span>
                      <span className="text-green-400 font-semibold">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Transaction Success
                      </span>
                      <span className="text-green-400 font-semibold">
                        Excellent
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Insights
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ Platform performing optimally</li>
                    <li>✓ High user engagement</li>
                    <li>✓ Quality events increasing</li>
                    <li>✓ Healthy revenue growth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-semibold">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-semibold">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p
                  className={`font-semibold ${
                    selectedUser.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Joined</p>
                <p className="text-white font-semibold">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {selectedEvent.imageUrl && (
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.eventtitle}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-gray-400 text-sm">Title</p>
                <p className="text-white font-semibold text-lg">
                  {selectedEvent.eventtitle}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-gray-300">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-semibold">
                    ₹{selectedEvent.price}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p
                    className={`font-semibold ${
                      selectedEvent.status === "approved"
                        ? "text-green-400"
                        : selectedEvent.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedEvent.status}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Transaction Details
              </h2>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">User</p>
                <p className="text-white font-semibold">
                  {selectedTxn.user?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Event</p>
                <p className="text-white font-semibold">
                  {selectedTxn.event?.eventtitle}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-white font-semibold text-lg">
                  ₹{selectedTxn.amount}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p
                  className={`font-semibold ${
                    selectedTxn.status === "success"
                      ? "text-green-400"
                      : selectedTxn.status === "refunded"
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedTxn.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
