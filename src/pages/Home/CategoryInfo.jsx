import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryInfo = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();

  useEffect(() => {
    fetchEventsbyCategories();
  }, [category]);

  const navigate = useNavigate();

  const fetchEventsbyCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://event-hub-backend-uzcs.onrender.com/api/organizer/getallevents"
      );

      const filtered = res.data.filter(
        e => e.category?.toLowerCase() === category.toLowerCase()
      );

      setCategories(filtered);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] text-white">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent capitalize">
            {category}
          </span>{" "}
          Events
        </h1>
        <p className="text-gray-400 mt-2">
          Discover events related to {category}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-20">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-3xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-purple-600/20 to-pink-600/20 mb-6">
              🎉
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No events found
            </h3>
            <p className="text-gray-400">
              There are currently no events in this category.
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(e => (
              <div
                key={e._id}
                className="group relative bg-linear-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={e.imageUrl || "/placeholder-event.jpg"}
                    alt={e.eventtitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {e.eventtitle}
                  </h3>

                  <div className="text-sm text-gray-400 mb-2">
                    {new Date(e.startDate).toLocaleDateString()} • {e.startTime}
                  </div>

                  <div className="text-sm text-gray-400 truncate mb-4">
                    {e.venueName}, {e.city}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs px-3 py-1 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold">
                      {e.category}
                    </span>

                    <button
                    type="button"
                      className="text-sm font-semibold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80"
                      onClick={() => navigate(`/event/${e._id}`)}
                    >
                      View details →
                      
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryInfo;
