import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* DATE FORMATTER */
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  /* FILTER STATES */
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    priceMin: "",
    priceMax: ""
  });

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const navigate = useNavigate();

  /* FETCH EVENTS */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://event-hub-backend-uzcs.onrender.com/api/organizer/getallevents"
      );

      const eventsData = res.data || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /* SMART SEARCH */
  const handleSearch = (value) => {
    const raw = value || "";
    setSearchInput(raw);
    applyFilters(raw, selectedCategory, filters);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    applyFilters(searchInput, category, filters);
    setCurrentPage(1);
  };

  /* FILTER INPUT HANDLERS */
  const handleFilterChange = (filterName, value) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
    applyFilters(searchInput, selectedCategory, updatedFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSelectedCategory("all");
    setFilters({ date: "", location: "", priceMin: "", priceMax: "" });
    setCurrentPage(1);
    setFilteredEvents(events);
  };

  const applyFilters = (rawSearch, category, activeFilters) => {
    let filtered = events;
    const text = (rawSearch || "").toLowerCase();

    if (text) {
      filtered = filtered.filter(
        (event) =>
          event.eventtitle?.toLowerCase().includes(text) ||
          event.category?.toLowerCase().includes(text) ||
          event.venueName?.toLowerCase().includes(text) ||
          event.city?.toLowerCase().includes(text)
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(
        (event) => event.category === category
      );
    }

    if (activeFilters.date) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate)
          .toISOString()
          .split("T")[0];
        return eventDate === activeFilters.date;
      });
    }

    if (activeFilters.location) {
      const loc = activeFilters.location.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.venueName?.toLowerCase().includes(loc) ||
          event.city?.toLowerCase().includes(loc)
      );
    }

    if (activeFilters.priceMin || activeFilters.priceMax) {
      const minPrice = activeFilters.priceMin
        ? Number(activeFilters.priceMin)
        : 0;
      const maxPrice = activeFilters.priceMax
        ? Number(activeFilters.priceMax)
        : Infinity;

      filtered = filtered.filter(
        (event) =>
          event.price >= minPrice && event.price <= maxPrice
      );
    }

    setFilteredEvents(filtered);
  };

  /* PAGINATION LOGIC */
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(
    filteredEvents.length / eventsPerPage
  );

  const handleClick = (id) => {
    navigate(`/Event/${id}`);
  };

  const categories = [
    "all",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] py-6 sm:py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Back button (TOP) */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Search events by name, venue..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-2xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                🔍 {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {(filters.date ||
                filters.location ||
                filters.priceMin ||
                filters.priceMax ||
                selectedCategory !== "all" ||
                searchInput) && (
                <button
                  onClick={resetFilters}
                  className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm sm:text-base"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="bg-gradient-to-br from-[#1b1b26] via-[#141420] to-[#0d0d14] rounded-3xl border border-white/10 p-8 mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">

            <h2 className="text-white text-xl font-semibold mb-8">
              Filter Events
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(
                    (c) =>
                      c !== "all" && (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    handleFilterChange("date", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Location</label>
                <input
                  type="text"
                  placeholder="City or venue..."
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white"
                />
              </div>

            </div>
          </div>
        )}

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-8 text-sm text-gray-400">
          <span>
            Showing {currentEvents.length > 0 ? indexOfFirstEvent + 1 : 0} –{" "}
            {Math.min(indexOfLastEvent, filteredEvents.length)} of{" "}
            {filteredEvents.length} events
          </span>
        </div>

        {/* EVENTS GRID */}
        {currentEvents.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No Events Found</p>
            <p className="text-sm mt-2 text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {currentEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => handleClick(event._id)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b1b26] to-[#101018] border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/20"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.eventtitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-base text-white mb-2 line-clamp-2 group-hover:text-purple-300">
                    {event.eventtitle}
                  </h3>

                  <p className="text-sm text-gray-400 truncate mb-1">
                    {event.venueName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
