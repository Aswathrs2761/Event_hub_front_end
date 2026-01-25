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
          `http://localhost:5000/api/organizer/getEventsById/${id}`
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
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate("/events")}
            className="bg-black/40 px-6 py-3 rounded-2xl text-white"
          >
            Back to Events
          </button>
        </div>

        <div className="relative z-10 w-full px-6 lg:px-16 pt-24 pb-12 h-full flex items-end">
          <div className="max-w-4xl">
            <span className="inline-block bg-linear-to-r from-pink-600 to-purple-600 text-white text-sm px-6 py-2 rounded-full font-semibold mb-4">
              {event.category}
            </span>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {event.eventtitle}
            </h1>

            <p className="text-gray-300 text-lg">
              {event.venueName}, {event.city}, {event.state}
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="w-full px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
        {/* LEFT */}
        <div className="space-y-12">
          <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              About This Event
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">
                Event Info
              </h3>
              <p className="text-gray-400 text-sm">
                Starts: {new Date(event.startDate).toLocaleDateString()} at{" "}
                {event.startTime}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Ends: {new Date(event.endDate).toLocaleDateString()} at{" "}
                {event.endTime}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">
                Venue Info
              </h3>
              <p className="text-gray-400 text-sm">{event.venueName}</p>
              <p className="text-gray-400 text-sm mt-2">
                {event.address}, {event.city}, {event.state}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="sticky top-24 bg-linear-to-br from-[#1a1a24]/95 to-[#0f0f14]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Select Tickets
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Choose ticket type & quantity
            </p>

            <div className="space-y-4 mb-6">
              {event.tickets.map((ticket) => {
                const isSelected = selectedTicket?._id === ticket._id;
                const isSoldOut = ticket.remaining === 0;

                return (
                  <div
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                      isSelected
                        ? "border-pink-500 bg-linear-to-r from-pink-600/15 to-purple-600/15"
                        : "border-white/10 bg-white/5"
                    } ${isSoldOut && "opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold text-white">
                          {ticket.ticketType || ticket.type}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {ticket.description || "Standard ticket"}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-pink-400">
                        ₹{ticket.price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {ticket.remaining || ticket.quantity} remaining
                    </p>
                  </div>
                );
              })}
            </div>

            {selectedTicket && (
              <div className="mb-6">
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/10">
                  <button onClick={decreaseQty}>−</button>
                  <span className="text-white font-bold">{quantity}</span>
                  <button onClick={increaseQty}>+</button>
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Total</span>
                <span className="text-2xl font-bold text-pink-400">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                disabled={!selectedTicket}
                onClick={() => setShowCheckout(true)}
                className="w-full bg-linear-to-r from-pink-600 to-purple-600 text-white py-3 rounded-2xl font-bold disabled:opacity-50"
              >
                Get Tickets Now
              </button>

              {showCheckout && (
                <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/10">
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