import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* Category UI config */
const CATEGORY_META = {
  Music: { icon: "🎵", color: "from-purple-600 to-pink-600", bgColor: "from-purple-500/10 to-pink-500/10" },
  Business: { icon: "💼", color: "from-blue-600 to-indigo-600", bgColor: "from-blue-500/10 to-indigo-500/10" },
  Tech: { icon: "💻", color: "from-indigo-600 to-purple-600", bgColor: "from-indigo-500/10 to-purple-500/10" },
  Sports: { icon: "🏀", color: "from-orange-600 to-red-600", bgColor: "from-orange-500/10 to-red-500/10" },
  Art: { icon: "🎨", color: "from-pink-600 to-rose-600", bgColor: "from-pink-500/10 to-rose-500/10" },
  Food: { icon: "🍔", color: "from-green-600 to-emerald-600", bgColor: "from-green-500/10 to-emerald-500/10" },
  Health: { icon: "🩺", color: "from-red-600 to-pink-600", bgColor: "from-red-500/10 to-pink-500/10" },
  Other: { icon: "🎉", color: "from-fuchsia-600 to-purple-600", bgColor: "from-fuchsia-500/10 to-purple-500/10" },
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/organizer/getallevents"
        );

        // ✅ Safe fallback
        const events = res.data || [];
        console.log("Fetched events:", res.data);

        /* 🔥 GROUP EVENTS BY CATEGORY */
        const grouped = events.reduce((acc, event) => {
          const cat = event.category || "Other";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        /* Convert to array for UI */
        const categoryArray = Object.keys(grouped).map((cat) => ({
          name: cat,
          count: grouped[cat],
          icon: CATEGORY_META[cat]?.icon || "🎉",
          color: CATEGORY_META[cat]?.color || "from-gray-600 to-gray-700",
          bgColor: CATEGORY_META[cat]?.bgColor || "from-gray-500/10 to-gray-600/10",
        }));

        setCategories(categoryArray);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

  const handleCategoryClick = (categoryName) => {
    navigate(`/explore/${categoryName.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-xl w-64 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Categories Available</h3>
            <p className="text-gray-400 mb-6">Check back later for new event categories.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d]">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Explore by <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Category</span>
          </h1>
          <p className="text-base text-gray-400 max-w-3xl mx-auto">
            Discover events that match your interests from our diverse range of categories. Find the perfect experience for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 bg-linear-to-br ${cat.bgColor} to-transparent`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative p-6">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-linear-to-r ${cat.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {cat.count} event{cat.count !== 1 ? 's' : ''} available
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 text-center">
          <div className="bg-linear-to-r from-purple-600/10 to-pink-600/10 rounded-2xl border border-purple-500/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xl font-semibold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </div>
                <div className="text-gray-400 text-sm">Total Events</div>
              </div>
              <div>
                <div className="text-xl font-semibold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {categories.length}
                </div>
                <div className="text-gray-400 text-sm">Categories</div>
              </div>
              <div>
                <div className="text-xl font-semibold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  ∞
                </div>
                <div className="text-gray-400 text-sm">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
