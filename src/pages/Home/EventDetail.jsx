import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatePayment from "../OrganizerDashboard/CreatePayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://event-hub-backend-uzcs.onrender.com/api/organizer/getEventsById/${id}`
        );
        setEvent(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSelectTicket = (ticket) => {
    if (ticket.remaining === 0) return;
    setSelectedTicket(ticket);
    setQuantity(1);
  };

  const increaseQty = () => {
    if (!selectedTicket) return;
    if (quantity < (selectedTicket.remaining || selectedTicket.quantity)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const totalPrice = selectedTicket ? quantity * selectedTicket.price : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d]" />
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center">
        <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-12 shadow-2xl">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Event Not Found
            </h3>
            <p className="text-gray-400 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-6 py-3 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d]">
      {/* HERO */}
      <div
        className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
          <button
            onClick={() => navigate("/events")}
            className="bg-black/40 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl text-white text-sm sm:text-base"
          >
            ← Back
          </button>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-16 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 h-full flex items-end">
          <div className="max-w-4xl w-full">
            <span className="inline-block bg-linear-to-r from-pink-600 to-purple-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-1 sm:py-2 rounded-full font-semibold mb-3 sm:mb-4">
              {event.category}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3 sm:mb-6 bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              {event.eventtitle}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              {event.venueName}, {event.city}, {event.state}
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 sm:gap-8 md:gap-10">
        {/* LEFT */}
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              About This Event
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-white/5 rounded-lg sm:rounded-2xl p-4 sm:p-8 border border-white/10">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3">
                Event Info
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Starts: {new Date(event.startDate).toLocaleDateString()} at{" "}
                {event.startTime}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                Ends: {new Date(event.endDate).toLocaleDateString()} at{" "}
                {event.endTime}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg sm:rounded-2xl p-4 sm:p-8 border border-white/10">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3">
                Venue Info
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">{event.venueName}</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                {event.address}, {event.city}, {event.state}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="sticky top-24 bg-linear-to-br from-[#1a1a24]/95 to-[#0f0f14]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
              Select Tickets
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Choose ticket type & quantity
            </p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-80 overflow-y-auto">
              {event.tickets.map((ticket) => {
                const isSelected = selectedTicket?._id === ticket._id;
                const isSoldOut = ticket.remaining === 0;

                return (
                  <div
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`cursor-pointer rounded-lg sm:rounded-2xl p-3 sm:p-5 border transition-all text-sm sm:text-base ${
                      isSelected
                        ? "border-pink-500 bg-linear-to-r from-pink-600/15 to-purple-600/15"
                        : "border-white/10 bg-white/5"
                    } ${isSoldOut && "opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm sm:text-base">
                          {ticket.ticketType || ticket.type}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {ticket.description || "Standard ticket"}
                        </p>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-pink-400 whitespace-nowrap">
                        ₹{ticket.price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {ticket.remaining || ticket.quantity} remaining
                    </p>
                  </div>
                );
              })}
            </div>

            {selectedTicket && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                  <button onClick={decreaseQty} className="w-12 h-8 text-3xl flex items-center font-extrabold text-pink-500 justify-center">−</button>
                  <span className="text-white font-bold text-sm sm:text-base">{quantity}</span>
                  <button onClick={increaseQty} className="w-12 h-8 text-3xl  flex items-center font-extrabold text-pink-500 justify-center">+</button>
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm sm:text-base">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-pink-400">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                disabled={!selectedTicket}
                onClick={() => setShowCheckout(true)}
                className="w-full bg-linear-to-r from-pink-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base"
              >
                Get Tickets Now
              </button>

              {showCheckout && (
                <div className="mt-4 p-3 sm:p-4 bg-white/10 rounded-lg sm:rounded-2xl border border-white/10">
                  <Elements stripe={stripePromise}>
                    <CreatePayment
                      eventId={event._id}
                      price={totalPrice}
                      ticketType={
                        selectedTicket?.ticketType || selectedTicket?.type
                      }
                      quantity={quantity}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;