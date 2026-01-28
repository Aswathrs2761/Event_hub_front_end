import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://event-hub-backend-uzcs.onrender.com/api/payment/my-tickets",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(res);
      
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err?.response?.data?.message || "Failed to load tickets");
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

 const handleCancel = async (ticketId) => {
  if (!window.confirm("Are you sure you want to cancel this ticket and get a refund?")) {
    return;
  }

  try {
    await axios.delete(
      `https://event-hub-backend-uzcs.onrender.com/api/payment/cancel-ticket/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    
    );
    
    toast.success("Ticket cancelled & refund initiated");
    fetchUserTickets(); // refresh list
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to cancel ticket");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Error Loading Tickets
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchUserTickets}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              My Tickets
            </h1>
            <p className="text-gray-400 text-lg">
              View and manage your purchased event tickets
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition"
          >
            ← Back
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't purchased any tickets yet.
            </p>
            <button
              onClick={() => (window.location.href = "/events")}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((order) => {
              const t = order.tickets?.[0];

              return (
                <div
                  key={order._id}
                  className="bg-purple-900/30 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02]"
                >
                  {/* Image */}
                  {/* <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    {order.event?.imageUrl ? (
                      <img
                        src={order.event.imageUrl}
                        alt={order.event.eventtitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                        {order.status}
                      </span>
                    </div>
                  </div> */}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {order.event?.eventtitle}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {order.event?.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-300">
                      <div>
                        📅{" "}
                        {order.event?.startDate
                          ? new Date(
                              order.event.startDate
                            ).toLocaleDateString()
                          : "N/A"}{" "}
                        at {order.event?.startTime}
                      </div>
                      <div>
                        📍 {order.event?.venueName}, {order.event?.city}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Type</p>
                          <p className="text-white font-medium">
                            {t?.ticketType || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Quantity</p>
                          <p className="text-white font-medium">
                            {t?.quantity || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Price</p>
                          <p className="text-white font-medium">
                            ₹{t?.price || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total</p>
                          <p className="text-pink-400 font-bold">
                            ₹{order.amount || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Purchased on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>

                    {order.status === "success" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="mt-4 w-full py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
                      >
                        Cancel Ticket & Refund
                      </button>
                    )}

                    {order.status === "refunded" && (
                      <div className="mt-4 text-center text-green-400 text-sm font-medium">
                        Refunded
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;