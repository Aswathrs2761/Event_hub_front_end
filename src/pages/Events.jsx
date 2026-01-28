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
  };

  const applyFilters = (rawSearch, category, activeFilters) => {
    let filtered = events;
    const text = (rawSearch || "").toLowerCase();

    // Text search
    if (text) {
      filtered = filtered.filter(
        (event) =>
          event.eventtitle?.toLowerCase().includes(text) ||
          event.category?.toLowerCase().includes(text) ||
          event.venueName?.toLowerCase().includes(text) ||
          event.city?.toLowerCase().includes(text)
      );
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((event) => event.category === category);
    }

    // Date filter
    if (activeFilters.date) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate)
          .toISOString()
          .split("T")[0];
        return eventDate === activeFilters.date;
      });
    }

    // Location filter
    if (activeFilters.location) {
      const loc = activeFilters.location.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.venueName?.toLowerCase().includes(loc) ||
          event.city?.toLowerCase().includes(loc)
      );
    }

    // Price range filter
    if (activeFilters.priceMin || activeFilters.priceMax) {
      const minPrice = activeFilters.priceMin ? Number(activeFilters.priceMin) : 0;
      const maxPrice = activeFilters.priceMax ? Number(activeFilters.priceMax) : Infinity;
      filtered = filtered.filter(
        (event) => event.price >= minPrice && event.price <= maxPrice
      );
    }

    setFilteredEvents(filtered);
  };

  /* PAGINATION LOGIC */
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = (filteredEvents || []).slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil((filteredEvents?.length || 0) / eventsPerPage);

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
        {/* SEARCH SECTION */}
        <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search events by name, venue..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-2xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-purple-500"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>🔍</span> <span className="hidden sm:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span><span className="sm:hidden">{showFilters ? "Hide" : "Show"}</span>
              </button>
              {(filters.date || filters.location || filters.priceMin || filters.priceMax || selectedCategory !== "all" || searchInput) && (
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

        {/* FILTERS PANEL */}
        {showFilters && (
          <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-2xl backdrop-blur-sm">
            <h2 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">Filter Events</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-white font-semibold mb-2 text-xs sm:text-sm">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="all" className="bg-gray-800">All Categories</option>
                  {categories.map((category) => (
                    category !== "all" && (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    )
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-white font-semibold mb-2 text-xs sm:text-sm">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-white font-semibold mb-2 text-xs sm:text-sm">Location</label>
                <input
                  type="text"
                  placeholder="City or venue..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Price Min */}
              <div>
                <label className="block text-white font-semibold mb-2 text-xs sm:text-sm">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Price Max */}
              <div>
                <label className="block text-white font-semibold mb-2 text-xs sm:text-sm">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* RESULTS COUNT */}
        <div className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Showing {currentEvents.length > 0 ? indexOfFirstEvent + 1 : 0} - {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
        </div>

        {/* EVENTS GRID */}
        {currentEvents.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-gray-400">
            <p className="text-base sm:text-lg">No Events Found</p>
            <p className="text-xs sm:text-sm mt-2">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {currentEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => handleClick(event._id)}
                className="cursor-pointer bg-[#1a1a24] rounded-lg sm:rounded-2xl overflow-hidden hover:scale-105 transition transform"
              >
                <img
                  src={event.imageUrl}
                  alt={event.eventtitle}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-3 sm:p-4 text-white">
                  <h3 className="font-bold text-sm sm:text-lg mb-1 line-clamp-2">
                    {event.eventtitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{event.venueName}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(event.startDate)}
                  </p>
                 
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 sm:gap-2 mt-8 sm:mt-10 flex-wrap px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 sm:px-4 py-2 rounded transition text-sm sm:text-base ${
                  currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
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