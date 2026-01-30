import { useEffect, useState } from "react";
import { getEvents } from "../../api/events";
import { useNavigate } from "react-router-dom";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();

      const eventsData = res.data || [];

      const sortedEvents = eventsData
        .sort((a, b) => {
          const dateA = new Date(`${a.startDate}T${a.startTime}`);
          const dateB = new Date(`${b.startDate}T${b.startTime}`);
          return dateB - dateA;
        })
        .slice(0, 6);

      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-xl w-64 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  function to12Hour(time) {
    if (!time) return "";
    let [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Upcoming{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="text-gray-400 mt-4 text-base max-w-md">
            Don't miss out on these amazing experiences happening soon
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/Events")}
          className="group px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-purple-500/30 transition-all duration-300 text-white font-medium"
        >
          <div className="flex items-center gap-2">
            <span>View All Events</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => handleClick(event._id)}
            className="group relative bg-linear-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={event.imageUrl || "/placeholder-event.jpg"}
                alt={event.eventtitle}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 text-sm rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg">
                {event.category}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4 leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                {event.eventtitle}
              </h3>

              <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{to12Hour(event.startTime)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">
                  {event.venueName}, {event.city}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                

                <button
                  type="button"
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                >
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-12 shadow-2xl max-w-md mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              No Upcoming Events
            </h3>
            <p className="text-gray-400 mb-6">
              Check back later for new events.
            </p>

            <button
              type="button"
              onClick={() => navigate("/Events")}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              Browse All Events
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
