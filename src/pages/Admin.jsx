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

  const [userPage, setUserPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [txnPage, setTxnPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [txnStatus, setTxnStatus] = useState("");
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalEventPages, setTotalEventPages] = useState(1);
  const [totalTxnPages, setTotalTxnPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!isLoggedIn || role !== "admin") {
    nav("/login");
    return null;
  }

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "events") fetchEvents();
    if (activeTab === "transactions") fetchTransactions();
  }, [
    activeTab,
    userPage,
    userSearch,
    eventPage,
    eventStatus,
    txnPage,
    txnStatus,
  ]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, statsRes] = await Promise.all([
        axios.get(
          "https://event-hub-backend-uzcs.onrender.com/api/admin/dashboard",
          { headers }
        ),
        axios.get(
          "https://event-hub-backend-uzcs.onrender.com/api/admin/reports/stats",
          { headers }
        ),
      ]);

      setOverview(dashboardRes.data.data);
      setStats(statsRes.data.data);
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Failed to load transactions");
    }
  };

  const toggleUserStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/users/${id}/status`,
        { status: status === "active" ? "suspended" : "active" },
        { headers }
      );
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/users/${id}`,
        { headers }
      );
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const approveEvent = async (id) => {
    try {
      await axios.put(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/events/${id}/status`,
        { status: "approved" },
        { headers }
      );
      toast.success("Event approved");
      fetchEvents();
    } catch {
      toast.error("Failed to approve event");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/events/${id}`,
        { headers }
      );
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const processRefund = async (id) => {
    if (!window.confirm("Process refund?")) return;
    try {
      await axios.patch(
        `https://event-hub-backend-uzcs.onrender.com/api/admin/transactions/${id}/refund`,
        {},
        { headers }
      );
      toast.success("Refund processed");
      fetchTransactions();
    } catch {
      toast.error("Failed to process refund");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "events", label: "Events" },
    { id: "transactions", label: "Transactions" },
    { id: "reports", label: "Reports" },
  ];

  const Card = ({ children }) => (
    <div className="rounded-2xl border border-purple-500/10 bg-gradient-to-br from-[#0c0816] via-[#120a22] to-[#0c0816] shadow-xl shadow-purple-900/40">
      {children}
    </div>
  );

  if (loading && activeTab === "dashboard") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0714] via-[#140a22] to-[#0a0714]">
        <div className="text-center">
          <div className="w-12 h-12 border-b-2 border-pink-500 rounded-full animate-spin mx-auto" />
          <p className="text-purple-200/70 mt-4">
            Loading admin dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0714] via-[#140a22] to-[#0a0714]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-purple-200/60 mt-1">
              Manage users, events, payments and platform health
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              nav("/login");
            }}
            className="px-6 py-3 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-pink-500 to-purple-600
            text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition
              ${
                activeTab === t.id
                  ? "bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/30 text-white shadow"
                  : "border border-white/10 text-purple-200/70 hover:text-white hover:border-purple-400/30 hover:bg-purple-500/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------------- DASHBOARD ---------------- */}
        {activeTab === "dashboard" && overview && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Total Users", overview.totalUsers],
                ["Total Events", overview.totalEvents],
                ["Total Tickets", overview.totalTickets],
                ["Total Revenue", `₹${overview.totalRevenue || 0}`],
              ].map((c, i) => (
                <Card key={i}>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-wider text-purple-200/60">
                      {c[0]}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      {c[1]}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Event Status
                  </h3>

                  {[
                    ["Approved", overview.approvedEvents, "bg-emerald-500"],
                    ["Pending", overview.pendingEvents, "bg-amber-500"],
                  ].map((row) => (
                    <div key={row[0]}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-purple-200/60">{row[0]}</span>
                        <span className="text-white">{row[1]}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full">
                        <div
                          className={`h-2 rounded-full ${row[2]}`}
                          style={{
                            width: `${
                              overview.totalEvents
                                ? (row[1] / overview.totalEvents) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Ticket Success Rate
                  </h3>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-purple-200/60">
                      Success rate
                    </span>
                    <span className="text-white">
                      {overview.totalTickets
                        ? (
                            (overview.successfulTickets /
                              overview.totalTickets) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
                      style={{
                        width: `${
                          overview.totalTickets
                            ? (overview.successfulTickets /
                                overview.totalTickets) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    ["Total Users", stats.totalUsers],
                    ["Active Events", stats.activeEvents],
                    ["Total Tickets", stats.totalTickets],
                    ["Pending Events", stats.pendingEvents],
                    ["Total Events", stats.totalEvents],
                    ["Revenue", `₹${stats.totalRevenue || 0}`],
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs text-purple-200/60">
                        {s[0]}
                      </p>
                      <p className="text-lg font-semibold text-white mt-1">
                        {s[1]}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ---------------- USERS ---------------- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <input
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUserPage(1);
              }}
              placeholder="Search users…"
              className="w-full md:max-w-md px-4 py-3 rounded-xl
              bg-white/5 border border-white/10 text-white
              focus:outline-none focus:border-purple-400/40"
            />

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-purple-200/60 border-b border-white/10">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <td className="p-4 text-white">{u.name}</td>
                        <td className="p-4 text-purple-200/70">
                          {u.email}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {u.role}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {u.status}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 flex gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              toggleUserStatus(u._id, u.status)
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                          >
                            {u.status === "active"
                              ? "Suspend"
                              : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-400/30 text-rose-300 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {totalUserPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalUserPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setUserPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold
                    ${
                      userPage === i + 1
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "border border-white/10 text-purple-200/70 hover:bg-purple-500/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- EVENTS ---------------- */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <select
              value={eventStatus}
              onChange={(e) => {
                setEventStatus(e.target.value);
                setEventPage(1);
              }}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-400/40"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-purple-200/60 border-b border-white/10">
                      <th className="p-4">Title</th>
                      <th className="p-4">Organizer</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr
                        key={e._id}
                        className="border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <td className="p-4 text-white">
                          {e.eventtitle}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {e.user?.name || "N/A"}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {e.status}
                        </td>
                        <td className="p-4 flex gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedEvent(e)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                          >
                            View
                          </button>

                          {(e.status === "pending" ||
                            e.status === "approve") && (
                            <button
                              onClick={() => approveEvent(e._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => deleteEvent(e._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-400/30 text-rose-300 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ---------------- TRANSACTIONS ---------------- */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <select
              value={txnStatus}
              onChange={(e) => {
                setTxnStatus(e.target.value);
                setTxnPage(1);
              }}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-400/40"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-purple-200/60 border-b border-white/10">
                      <th className="p-4">User</th>
                      <th className="p-4">Event</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t._id}
                        className="border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <td className="p-4 text-white">
                          {t.user?.name}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {t.event?.eventtitle}
                        </td>
                        <td className="p-4 text-white font-semibold">
                          ₹{t.amount}
                        </td>
                        <td className="p-4 text-purple-200/70">
                          {t.status}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => setSelectedTxn(t)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                          >
                            View
                          </button>
                          {t.status === "success" && (
                            <button
                              onClick={() =>
                                processRefund(t._id)
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
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
            </Card>
          </div>
        )}

        {/* ---------------- REPORTS ---------------- */}
        {activeTab === "reports" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Total Users", stats.totalUsers],
              ["Active Events", stats.activeEvents],
              ["Total Tickets", stats.totalTickets],
              ["Pending Events", stats.pendingEvents],
              ["Total Events", stats.totalEvents],
              ["Revenue", `₹${stats.totalRevenue || 0}`],
            ].map((r, i) => (
              <Card key={i}>
                <div className="p-6">
                  <p className="text-xs text-purple-200/60">{r[0]}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {r[1]}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- MODALS (unchanged features, styled) ---------------- */}

      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)} title="User details">
          <ModalRow label="Name" value={selectedUser.name} />
          <ModalRow label="Email" value={selectedUser.email} />
          <ModalRow label="Status" value={selectedUser.status} />
          <ModalRow
            label="Joined"
            value={new Date(
              selectedUser.createdAt
            ).toLocaleDateString()}
          />
        </Modal>
      )}

      {selectedEvent && (
        <Modal
          onClose={() => setSelectedEvent(null)}
          title="Event details"
          wide
        >
          {selectedEvent.imageUrl && (
            <img
              src={selectedEvent.imageUrl}
              alt=""
              className="w-full h-52 object-cover rounded-xl mb-4"
            />
          )}
          <ModalRow
            label="Title"
            value={selectedEvent.eventtitle}
          />
          <ModalRow
            label="Description"
            value={selectedEvent.description}
          />
          <div className="grid grid-cols-2 gap-4">
            <ModalRow
              label="Price"
              value={`₹${selectedEvent.price}`}
            />
            <ModalRow
              label="Status"
              value={selectedEvent.status}
            />
          </div>
        </Modal>
      )}

      {selectedTxn && (
        <Modal
          onClose={() => setSelectedTxn(null)}
          title="Transaction details"
        >
          <ModalRow
            label="User"
            value={selectedTxn.user?.name}
          />
          <ModalRow
            label="Event"
            value={selectedTxn.event?.eventtitle}
          />
          <ModalRow
            label="Amount"
            value={`₹${selectedTxn.amount}`}
          />
          <ModalRow
            label="Status"
            value={selectedTxn.status}
          />
        </Modal>
      )}
    </div>
  );
};

/* ---------- Small reusable UI ---------- */

const Modal = ({ title, children, onClose, wide }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
      className={`rounded-2xl border border-purple-400/20
      bg-gradient-to-br from-[#0c0816] via-[#120a22] to-[#0c0816]
      shadow-2xl shadow-purple-900/40
      p-6 w-full ${wide ? "max-w-2xl" : "max-w-md"}`}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-purple-200/70 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">{children}</div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-pink-500 to-purple-600
        text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition"
      >
        Close
      </button>
    </div>
  </div>
);

const ModalRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-purple-200/60">{label}</p>
    <p className="text-white font-medium mt-1 break-words">
      {value}
    </p>
  </div>
);

export default Admin;
