import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "Music",
  "Tech",
  "Business",
  "Sports",
  "Art",
  "Food",
  "Health",
  "Other",
];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventtitle: "",
    description: "",
    category: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venueName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [tickets, setTickets] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://event-hub-backend-uzcs.onrender.com/api/organizer/getEventsById/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const e = res.data;

        setForm({
          eventtitle: e.eventtitle || "",
          description: e.description || "",
          category: e.category || "",
          startDate: e.startDate?.slice(0, 10) || "",
          startTime: e.startTime || "",
          endDate: e.endDate?.slice(0, 10) || "",
          endTime: e.endTime || "",
          venueName: e.venueName || "",
          address: e.address || "",
          city: e.city || "",
          state: e.state || "",
          zipCode: e.zipCode || "",
        });

        setTickets(e.tickets || []);
        setCurrentImageUrl(e.imageUrl || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load event");
        navigate("/organizer");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateTicket = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      let imageUrl = currentImageUrl;

      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "event_images");
        data.append("folder", "events");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dlbavrgpu/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const imgResult = await res.json();
        imageUrl = imgResult.secure_url;
      }

      const payload = {
        ...form,
        imageUrl,
        tickets: tickets.map((t) => ({
          ticketType: t.ticketType,
          price: Number(t.price),
          quantity: Number(t.quantity),
        })),
      };

      await axios.put(
        `https://event-hub-backend-uzcs.onrender.com/api/payment/edit-event/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Event updated successfully!");
      navigate("/organizer");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-linear-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl border border-white/10 shadow-2xl p-8 space-y-10">
          <h1 className="text-3xl font-bold text-white">Edit Event</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Event Title"
                name="eventtitle"
                value={form.eventtitle}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
                  required
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-gray-800">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />

            {/* Dates */}
            <div className="grid md:grid-cols-4 gap-6">
              <Input
                type="date"
                label="Start Date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <Input
                type="time"
                label="Start Time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
              <Input
                type="date"
                label="End Date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
              <Input
                type="time"
                label="End Time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Venue */}
            <Input
              label="Venue Name"
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
              <Input
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
              <Input
                label="Zip Code"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tickets */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Ticket Information
              </h2>

              {tickets.map((t, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"
                >
                  <input
                    readOnly
                    value={t.ticketType}
                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                  <input
                    type="number"
                    value={t.price}
                    onChange={(e) =>
                      updateTicket(i, "price", e.target.value)
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/20 text-white"
                  />
                  <input
                    type="number"
                    value={t.quantity}
                    onChange={(e) =>
                      updateTicket(i, "quantity", e.target.value)
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/20 text-white"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate("/organizer")}
                className="flex-1 py-3 rounded-xl bg-white/10 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold"
              >
                {saving ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white h-28 resize-none"
      />
    </div>
  );
}