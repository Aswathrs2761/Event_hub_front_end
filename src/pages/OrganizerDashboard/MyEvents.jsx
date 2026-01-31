import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faEye,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://event-hub-backend-uzcs.onrender.com/api/payment/my-events",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(res.data.events || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const suspendEvent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://event-hub-backend-uzcs.onrender.com/api/payment/suspend/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, status: "suspended" } : e
        )
      );
    } catch (err) {
      console.error("Failed to suspend event:", err);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const visibleEvents = showAll
    ? filteredEvents
    : filteredEvents.slice(0, 6);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
      case "pending":
        return "bg-amber-500/15 text-amber-300 border-amber-400/30";
      case "suspended":
        return "bg-rose-500/15 text-rose-300 border-rose-400/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-400/30";
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-purple-500/10 bg-gradient-to-br from-[#0b0715] via-[#140b24] to-[#0b0715] p-8 shadow-2xl shadow-purple-900/40">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded-xl bg-white/10" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-purple-500/10 bg-gradient-to-br from-[#0b0715] via-[#140b24] to-[#0b0715] shadow-2xl shadow-purple-900/40 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-7 border-b border-purple-500/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              My Events
            </h2>
            <p className="text-sm text-purple-200/60 mt-1">
              View, manage and control your published events
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["all", "approved", "pending", "suspended"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${
                    filter === status
                      ? "bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white border border-pink-400/30 shadow-lg shadow-pink-500/10"
                      : "text-purple-200/70 border border-white/10 hover:text-white hover:border-purple-400/30 hover:bg-purple-500/10"
                  }`}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {visibleEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-purple-300 text-2xl"
              />
            </div>

            <h3 className="text-xl font-semibold text-white">
              No events found
            </h3>
            <p className="text-sm text-purple-200/60 mt-1">
              You haven’t created any events in this category yet
            </p>

            <button
              onClick={() => navigate("/create-event")}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-pink-500 to-purple-600
              text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition"
            >
              Create new event
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleEvents.map((ev) => (
              <div
                key={ev._id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-purple-400/30 transition-all duration-300 shadow-lg shadow-purple-900/20"
              >
                <div className="p-5 md:p-6 flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="relative shrink-0">
                    <img
                      src={ev.imageUrl || "/placeholder-event.jpg"}
                      alt={ev.eventtitle}
                      className="w-20 h-20 rounded-xl object-cover border border-white/20"
                      onError={(e) => {
                        e.target.src = "/placeholder-event.jpg";
                      }}
                    />

                    <span
                      className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur ${getStatusBadge(
                        ev.status
                      )}`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-pink-300 transition-colors truncate">
                          {ev.eventtitle}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-purple-200/70">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              className="text-pink-400"
                            />
                            <span>
                              {new Date(
                                ev.startDate
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 min-w-0">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="text-purple-400"
                            />
                            <span className="truncate">
                              {ev.venueName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUsers}
                              className="text-indigo-400"
                            />
                            <span>{ev.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/event/${ev._id}`)
                          }
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 hover:bg-pink-500/10 text-purple-200 hover:text-pink-300 transition"
                          title="View event"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                          />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/edit-event/${ev._id}`
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/40 hover:bg-purple-500/10 text-purple-200 hover:text-purple-300 transition"
                          title="Edit event"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                          />
                        </button>

                        <button
                          onClick={() =>
                            suspendEvent(ev._id)
                          }
                          disabled={
                            ev.status === "suspended"
                          }
                          className={`w-10 h-10 rounded-xl border transition
                          ${
                            ev.status ===
                            "suspended"
                              ? "bg-rose-500/10 border-rose-400/30 text-rose-300 cursor-not-allowed"
                              : "bg-white/5 border-white/10 text-purple-200 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                          }`}
                          title={
                            ev.status === "suspended"
                              ? "Already suspended"
                              : "Suspend event"
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredEvents.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-xl text-sm font-semibold
              border border-purple-400/30 text-purple-200
              hover:bg-purple-500/10 hover:border-purple-400/50 transition"
            >
              {showAll
                ? "Show less"
                : `Show all (${filteredEvents.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
