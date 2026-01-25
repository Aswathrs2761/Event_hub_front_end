import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";
import RecentSales from "./RecentSales";
import SalesReportChart from "./SalesReportChart";
import MyEvents from "./MyEvents";

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
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PaymentInfo />
              <RecentSales />
            </div>
            <SalesReportChart />
          </div>
        );
      case "events":
        return <MyEvents />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f14] via-[#111118] to-[#09090d] flex">
      {/* Sidebar */}
      <div className="w-64 bg-linear-to-b from-[#1a1a24] to-[#0f0f14] border-r border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <button
            onClick={() => navigate("/")}
            className="mb-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Organizer Hub
          </h1>
          <p className="text-gray-400 text-sm">Manage your events</p>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "create") {
                  navigate("/create"); // goes to CreateEvent.jsx
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 text-pink-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
}