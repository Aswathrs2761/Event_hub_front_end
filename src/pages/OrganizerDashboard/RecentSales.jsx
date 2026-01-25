import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/payment/recent-sales",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSales(res.data.sales || []);
        
      } catch (err) {
        console.error("Failed to load recent sales", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];

    for (const i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  return (
    <div className="w-full max-w-full rounded-3xl bg-linear-to-br from-[#1a1a24] to-[#0f0f14] p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Recent Sales</h3>
          <p className="text-gray-400 text-sm">Latest transactions and purchases</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">Live</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                  <div className="h-3 bg-white/5 rounded w-32"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-white/10 rounded w-16"></div>
                <div className="h-3 bg-white/5 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No Recent Sales</h4>
          <p className="text-gray-400 text-sm">Sales data will appear here once transactions are made</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((s, index) => {
            const initials = s.buyerName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={s._id || `sale-${index}`}
                className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {initials || "U"}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f0f14] flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors">
                      {s.buyerName}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {s.buyerEmail}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-bold text-lg">${s.amount}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeAgo(s.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sales.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Showing latest {Math.min(sales.length, 10)} transactions</span>
            <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
