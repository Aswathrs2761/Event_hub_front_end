import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORY_META = {
  music: { icon: "🎵", color: "from-purple-600 to-pink-600", displayName: "Music" },
  business: { icon: "💼", color: "from-blue-600 to-indigo-600", displayName: "Business" },
  tech: { icon: "💻", color: "from-indigo-600 to-purple-600", displayName: "Tech" },
  sports: { icon: "🏀", color: "from-orange-600 to-red-600", displayName: "Sports" },
  art: { icon: "🎨", color: "from-pink-600 to-rose-600", displayName: "Art" },
  food: { icon: "🍔", color: "from-green-600 to-emerald-600", displayName: "Food" },
  health: { icon: "🩺", color: "from-red-600 to-pink-600", displayName: "Health" },
  other: { icon: "🎉", color: "from-fuchsia-600 to-purple-600", displayName: "Other" },
};

const ExploreCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = category || 'other';
  const categoryData = CATEGORY_META[currentCategory] || CATEGORY_META.other;
  const displayName = categoryData.displayName;

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://event-hub-backend-uzcs.onrender.com/api/organizer/getallevents");
      const allEvents = res.data || [];

      const categoryEvents = allEvents.filter(
        (event) => event.category?.toLowerCase() === currentCategory.toLowerCase()
      );

      setFilteredEvents(categoryEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-12 shadow-2xl">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-8 py-16">
           
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${categoryData.color} flex items-center justify-center text-4xl shadow-2xl`}>
                {categoryData.icon}
              </div>
              <div>
                <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                  {displayName} Events
                </h1>
                <p className="text-lg text-gray-400">
                  Discover amazing {displayName.toLowerCase()} events in your area
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${categoryData.color} flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl`}>
              {categoryData.icon}
            </div>
            {/* <h2 className="text-3xl font-bold text-white mb-4">No {displayName} Events Found</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              There are currently no {displayName.toLowerCase()} events available. Check back later or explore other categories.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/categories')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Explore Categories
              </button>
              {/* <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl text-lg transition-all duration-300 border border-white/20"
              >
                View All Events
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => navigate('/categories')}
              className="group flex items-center gap-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl text-sm text-white transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Categories</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${categoryData.color} flex items-center justify-center text-4xl shadow-2xl`}>
              {categoryData.icon}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                {displayName} Events
              </h1>
              <p className="text-lg text-gray-400">
                {filteredEvents.length} amazing {displayName.toLowerCase()} event{filteredEvents.length !== 1 ? 's' : ''} waiting for you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => handleEventClick(event._id)}
              className="group bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 h-full flex flex-col"
            >
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={event.imageUrl || "/placeholder-event.jpg"}
                  alt={event.eventtitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 bg-gradient-to-r ${categoryData.color} text-white text-sm font-semibold rounded-full shadow-lg`}
                  >
                    {displayName}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {event.eventtitle}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} - {event.startTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <span className="truncate">
                      {event.venueName}, {event.city}
                    </span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategory;