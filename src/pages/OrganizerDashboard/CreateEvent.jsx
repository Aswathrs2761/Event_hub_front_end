import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";
import RecentSales from "./RecentSales";
import SalesReportChart from "./SalesReportChart";
import MyEvents from "./MyEvents";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "Music", "Tech", "Business", "Sports", "Art", "Food", "Health", "Other"
];

const ticketTypes = ["VIP",  "Gold", "Silver"];

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "events", label: "My Events", icon: "🎪" },
    { id: "create", label: "Create Event", icon: "➕" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <PaymentInfo />
              <RecentSales />
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 p-6 shadow-2xl">
              <SalesReportChart />
            </div>
          </div>
        );
      case "events":
        return <MyEvents />;
      case "create":
        return <CreateEventForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0014] via-[#0f0f1a] to-[#07070c] flex text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#1b102b] to-[#0b0b14] border-r border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
        <div className="p-6 border-b border-white/10">
          <button
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            ←
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Organizer Hub
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage your events</p>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${active
                    ? "bg-gradient-to-r from-pink-600/25 to-purple-600/25 border border-pink-500/30 text-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function CreateEventForm() {
  const [tickets, setTickets] = useState([]);
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const updateTicket = (i, field, value) => {
    const next = [...tickets];
    next[i][field] = value;
    setTickets(next);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    try {
      // Validate required fields
      if (!form.get("eventtitle")) return toast.error("Event title is required");
      if (!form.get("description")) return toast.error("Description is required");
      if (!imageFile) return toast.error("Please upload an event image");
      if (!category) return toast.error("Please select a category");
      if (category === "Other" && !otherCategory) return toast.error("Please specify the event category");
      if (tickets.length === 0) return toast.error("Please add at least one ticket type");

      const payload = {
        eventtitle: form.get("eventtitle"),
        description: form.get("description"),
        imageUrl: imagePreview,
        category,
        otherCategory: category === "Other" ? otherCategory : category,
        startDate: form.get("startDate"),
        startTime: form.get("startTime"),
        endDate: form.get("endDate"),
        endTime: form.get("endTime"),
        venueName: form.get("venueName"),
        address: form.get("address"),
        city: form.get("city"),
        state: form.get("state"),
        zipCode: form.get("zipCode"),
        tickets: tickets.map(t => ({
          ticketType: t.ticketType,
          price: Number(t.price),
          quantity: Number(t.quantity)
        }))
      };


      console.log("Category:", category);
      console.log("OtherCategory state:", otherCategory);
      console.log("Category === 'Other'?", category === "Other");
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      
      // Check if otherCategory is being added
      if (category === "Other") {
        console.log("Should have otherCategory in payload, value:", otherCategory);
        console.log("Payload has otherCategory?", "otherCategory" in payload);
        console.log("Payload.otherCategory =", payload.otherCategory);
      }

      await axios.post(
        "https://event-hub-backend-uzcs.onrender.com/api/organizer/createEvent",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Event created successfully!");
      e.target.reset();
      setTickets([]);
      setCategory("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error creating event:", err);
      console.error("Error response:", err.response?.data);
      console.error("Payload sent:", {
        eventtitle: form.get("eventtitle"),
        description: form.get("description"),
        category,
        startDate: form.get("startDate"),
        startTime: form.get("startTime"),
        endDate: form.get("endDate"),
        endTime: form.get("endTime"),
        venueName: form.get("venueName"),
        address: form.get("address"),
        city: form.get("city"),
        state: form.get("state"),
        zipCode: form.get("zipCode"),
        tickets
      });
      const errorMessage = err.response?.data?.message || err.message || "Failed to create event";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1028] to-[#0d0d16] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] p-10">
      <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        Create New Event
      </h2>
      <p className="text-gray-400 mb-8">Fill in the details below</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input name="eventtitle" label="Event Title" required />
        <Textarea name="description" label="Description" required />

        {/* Image Upload */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Event Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-600 file:to-purple-600 file:text-white hover:file:from-pink-700 hover:file:to-purple-700 cursor-pointer"
            />
          </div>
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <img
                src={imagePreview}
                alt="Event Preview"
                className="w-full h-48 object-cover rounded-xl border border-white/10"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Category</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl border transition ${category === c
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-500 shadow-lg"
                    : "bg-white/5 text-gray-300 border-white/20 hover:bg-white/10"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter custom event category"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input type="date" name="startDate" label="Start Date" required />
          <Input type="time" name="startTime" label="Start Time" required />
          <Input type="date" name="endDate" label="End Date" required />
          <Input type="time" name="endTime" label="End Time" required />
        </div>

        <Input name="venueName" label="Venue Name" required />
        <Input name="address" label="Address" required />

        <div className="grid grid-cols-3 gap-4">
          <Input name="city" label="City" required />
          <Input name="state" label="State" required />
          <Input name="zipCode" label="Zip Code" required />
        </div>

        {/* Tickets */}
        <div>
          <h3 className="font-semibold text-white mb-2">Tickets</h3>
          <div className="flex gap-2 mb-3">
            {ticketTypes.map(type => {
              const active = tickets.some(t => t.ticketType === type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    active
                      ? setTickets(tickets.filter(t => t.ticketType !== type))
                      : setTickets([...tickets, { ticketType: type, price: "", quantity: "" }])
                  }
                  className={`px-3 py-2 rounded-xl border transition ${active
                      ? "bg-pink-600 border-pink-500 text-white"
                      : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                    }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {tickets.map((t, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 mb-2">
              <input readOnly value={t.ticketType} className="input" />
              <input
                type="number"
                placeholder="Price"
                value={t.price}
                onChange={(e) => updateTicket(i, "price", e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Qty"
                value={t.quantity}
                onChange={(e) => updateTicket(i, "quantity", e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition shadow-lg shadow-pink-500/30"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 h-28 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}