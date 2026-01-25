import { useEffect, useState } from "react";
import { DollarSign, Ticket, Users, TrendingUp, Calendar, Target } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function PaymentInfo() {
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalOrders: 0,
    totalAttendees: 0,
    activeEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [previousStats, setPreviousStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        console.log(decoded);

        const [totalRes, ticketsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/payment/organizer-total", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/payment/tickets-sold", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const newStats = {
          totalAmount: totalRes.data.totalAmount || 0,
          totalOrders: ticketsRes.data.totalTicketsSold || 0,
          totalAttendees: totalRes.data.totalOrders || 0,
          activeEvents: totalRes.data.activeEvents || 0,
        };

        setPreviousStats(stats);
        setStats(newStats);
        console.log(ticketsRes.data.totalTicketsSold);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const cards = [
    {
      icon: DollarSign,
      value: `$${stats.totalAmount.toLocaleString()}`,
      label: "Total Revenue",
      change: calculateChange(stats.totalAmount, previousStats?.totalAmount),
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-500/10 to-emerald-600/10",
      borderColor: "border-green-500/20",
      glowColor: "shadow-green-500/20",
    },
    {
      icon: Ticket,
      value: stats.totalOrders.toLocaleString(),
      label: "Tickets Sold",
      change: calculateChange(stats.totalOrders, previousStats?.totalOrders),
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-500/10 to-cyan-600/10",
      borderColor: "border-blue-500/20",
      glowColor: "shadow-blue-500/20",
    },
    {
      icon: Users,
      value: stats.totalAttendees.toLocaleString(),
      label: "Total Orders",
      change: calculateChange(stats.totalAttendees, previousStats?.totalAttendees),
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-500/10 to-pink-600/10",
      borderColor: "border-purple-500/20",
      glowColor: "shadow-purple-500/20",
    },
    {
      icon: Calendar,
      value: stats.activeEvents.toLocaleString(),
      label: "Active Events",
      change: null,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-500/10 to-red-600/10",
      borderColor: "border-orange-500/20",
      glowColor: "shadow-orange-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="mb-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse"></div>
            <div>
              <div className="h-8 bg-white/10 rounded-xl w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-lg w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 bg-white/10 rounded-full w-20 animate-pulse"></div>
            <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse"></div>
          </div>
        </div>

        {/* Row Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-r from-[#1a1a24]/80 to-[#0f0f14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl"></div>
                  <div>
                    <div className="h-6 bg-white/10 rounded-lg w-32 mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 bg-white/10 rounded-xl w-20"></div>
                  <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Payment Analytics
            </h2>
            <p className="text-gray-400 text-sm mt-1">Monitor your event performance and revenue insights</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <div className="text-lg font-bold text-white">${stats.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Revenue</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="text-white" size={18} />
          </div>
        </div>
      </div>

      {/* Payment Info Rows */}
      <div className="space-y-4">
        {cards.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`group bg-gradient-to-r from-[#1a1a24]/90 via-[#0f0f14]/90 to-[#1a0b2e]/90 backdrop-blur-2xl border ${item.borderColor} rounded-3xl p-6 hover:shadow-2xl hover:${item.glowColor} transition-all duration-500 hover:scale-[1.01] cursor-pointer overflow-hidden`}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Decorative elements */}
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br ${item.color} rounded-full opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  {/* Left side - Icon and Label */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <Icon className="text-white" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                        {item.label}
                      </h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        Key performance metric
                      </p>
                    </div>
                  </div>

                  {/* Right side - Value and Change */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                        {item.value}
                      </div>
                      {item.change !== null && (
                        <div className={`flex items-center justify-end gap-1 mt-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-300 ${
                          item.change >= 0
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}>
                          <TrendingUp size={12} className={`transition-transform duration-300 ${item.change < 0 ? "rotate-180" : ""}`} />
                          {item.change >= 0 ? "+" : ""}{Math.abs(item.change).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color} rounded-b-3xl transition-all duration-500 w-0 opacity-0 group-hover:w-full group-hover:opacity-100`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-gradient-to-r from-[#1a1a24]/60 via-[#0f0f14]/60 to-[#1a0b2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2">Performance Overview</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your events are generating strong revenue with {stats.totalOrders.toLocaleString()} tickets sold across {stats.activeEvents} active events.
              Keep up the excellent work!
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalAttendees.toLocaleString()}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.activeEvents}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Active Events</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Target className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
