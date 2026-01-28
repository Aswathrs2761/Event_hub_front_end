import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faEye, faCalendar, faMapMarkerAlt, faUsers } from "@fortawesome/free-solid-svg-icons";

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
        const res = await axios.get("https://event-hub-backend-uzcs.onrender.com/api/payment/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const filteredEvents = events.filter(event => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, 6);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "suspended": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-xl w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">My Events</h2>
            <p className="text-gray-400 mt-1">Manage and track your event performance</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["all", "approved", "pending", "suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  filter === status
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-8">
        {visibleEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-gray-400">Create your first event to get started</p>
            <button className="mt-4 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg">
              Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleEvents.map((ev) => (
              <div
                key={ev._id}
                className="group bg-linear-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 p-6"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Event Image */}
                    <div className="relative">
                      <img
                        src={ev.imageUrl || "/placeholder-event.jpg"}
                        alt={ev.eventtitle}
                        className="w-20 h-20 rounded-2xl object-cover border border-white/20"
                        onError={(e) => {
                          e.target.src = "/placeholder-event.jpg";
                        }}
                      />
                      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(ev.status)}`}>
                        {ev.status}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {ev.eventtitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faCalendar} className="text-purple-400" />
                              <span>{new Date(ev.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400" />
                              <span className="truncate">{ev.venueName}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="text-green-400" />
                              <span>{ev.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/event/${ev._id}`)}
                            className="w-10 h-10 bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 rounded-xl flex items-center justify-center transition-all duration-200"
                            title="View Event"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-sm" />
                          </button>

                          <button
                            onClick={() => navigate(`/edit-event/${ev._id}`)}
                            className="w-10 h-10 bg-white/10 hover:bg-purple-500/20 hover:text-purple-400 rounded-xl flex items-center justify-center transition-all duration-200"
                            title="Edit Event"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                          </button>

                          <button
                            onClick={() => suspendEvent(ev._id)}
                            disabled={ev.status === "suspended"}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                              ev.status === "suspended"
                                ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                                : "bg-white/10 hover:bg-red-500/20 hover:text-red-400"
                            }`}
                            title={ev.status === "suspended" ? "Event Suspended" : "Suspend Event"}
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {filteredEvents.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-linear-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 font-medium"
            >
              {showAll ? "Show Less" : `Show All (${filteredEvents.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
