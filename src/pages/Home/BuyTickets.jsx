import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BuyTickets = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://event-hub-backend-uzcs.onrender.com/api/organizer/event/${id}`
      );
      setEvent(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    // Navigate to payment page with event and quantity
    nav("/CreatePayment", { state: { eventId: id, quantity, event } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-gray-400 mt-4">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Event not found</p>
          <button
            onClick={() => nav("/events")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.eventtitle}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {event.eventtitle}
                </h1>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-2xl">📍</span>
                    <span>{event.venueName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-2xl">📅</span>
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} at{" "}
                      {new Date(event.startDate).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-2xl">🎫</span>
                    <span>Category: {event.category}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Capacity</p>
                    <p className="text-white font-semibold text-lg">
                      {event.capacity || "Unlimited"}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Available Tickets</p>
                    <p className="text-white font-semibold text-lg">
                      {event.availableTickets || "Many"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl border border-white/10 p-8 shadow-2xl sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">
                Book Tickets
              </h2>

              <div className="space-y-6">
                {/* Price Display */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">Price per ticket</span>
                    <span className="text-white font-semibold">
                      ₹{event.price}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="flex-1 bg-white/5 border border-white/20 rounded text-white text-center py-2 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(20, quantity + 1))
                      }
                      className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-purple-400/30 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-semibold">
                      ₹{(event.price * quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">
                        Total
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={handleBuyTickets}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition shadow-2xl shadow-pink-500/50"
                >
                  Proceed to Payment
                </button>

                <button
                  onClick={() => nav("/events")}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition border border-white/20"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTickets;
