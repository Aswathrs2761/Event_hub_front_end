import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreatePayment({
  eventId,
  price = 0,
  ticketType = "General",
  quantity = 1,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      // 1️⃣ Create PaymentIntent from backend
      const res = await axios.post(
        "http://localhost:5000/api/payment/buy-Tickets",
        {
          eventId,
          ticketType,
          quantity,
          price: price / quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret, paymentIntentId } = res.data;

      // 2️⃣ Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // 3️⃣ Tell backend to save the ticket
        await axios.post(
          "http://localhost:5000/api/payment/confirm-ticket",
          {
            eventId,
            ticketType,
            quantity,
            price: price / quantity,
            paymentIntentId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Payment successful! Ticket booked 🎉");
        if (onSuccess) onSuccess();
        navigate('/ticket');
        
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-300">
          Card Information
        </label>
        <div className="p-4 bg-white/5 border border-white/20 rounded-xl">
          <CardElement />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !stripe}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl"
      >
        {loading ? "Processing..." : "Pay & Book Tickets"}
      </button>
    </div>
  );
}

export default CreatePayment;