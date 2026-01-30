import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function SalesReportChart() {
  const [labels, setLabels] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          "https://event-hub-backend-uzcs.onrender.com/api/payment/chart-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.chartData || [];

        const dates = data.map((d) => {
          const date = new Date(d._id);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        });
        const totals = data.map((d) => d.totalAmount);
        const total = totals.reduce((sum, amount) => sum + amount, 0);

        setLabels(dates);
        setAmounts(totals);
        setTotalSales(total);
        setError(null);
      } catch (err) {
        console.error("Chart load error", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-[#1a1a24] to-[#0f0f14] p-8 border border-white/10 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-xl w-64 mb-6"></div>
          <div className="h-80 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-[#1a1a24] to-[#0f0f14] p-8 border border-white/10 shadow-2xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.618-2.479M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m0 0V6a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Chart Load Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!labels.length || !amounts.length) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-[#1a1a24] to-[#0f0f14] p-8 border border-white/10 shadow-2xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Sales Data</h3>
          <p className="text-gray-400">Sales data will appear here once transactions are made</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Sales",
        data: amounts,
        borderColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
          gradient.addColorStop(1, 'rgba(118, 75, 162, 0.05)');
          return gradient;
        },
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: "#667eea",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 20, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: '#667eea',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          label: function(context) {
            return `Sales: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
            weight: '500'
          },
          padding: 10
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
          drawBorder: false
        },
        border: {
          color: "rgba(255,255,255,0.1)"
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
            weight: '500'
          },
          padding: 15,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
          drawBorder: false
        },
        border: {
          color: "rgba(255,255,255,0.1)"
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 4
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-[#1a1a24] to-[#0f0f14] p-8 border border-white/10 shadow-2xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Sales Analytics
          </h3>
          <p className="text-gray-400 text-sm">
            Last 7 days performance overview
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">
              ${totalSales.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Total Revenue
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div className="h-96 w-full bg-linear-to-br from-transparent to-white/5 rounded-2xl p-4">
          <Line data={chartData} options={options} />
        </div>

        {/* Chart Overlay Effects */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0f0f14]/20 to-transparent rounded-2xl pointer-events-none"></div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {amounts.length}
          </div>
          <div className="text-xs text-gray-400">
            Days Tracked
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            ${amounts.length > 0 ? (amounts.reduce((a, b) => a + b, 0) / amounts.length).toFixed(0) : '0'}
          </div>
          <div className="text-xs text-gray-400">
            Avg Daily
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            ${amounts.length > 0 ? Math.max(...amounts) : '0'}
          </div>
          <div className="text-xs text-gray-400">
            Peak Day
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${amounts.length > 1 && amounts[0] > 0 ? ((amounts[amounts.length - 1] - amounts[0]) / amounts[0] * 100) >= 0 ? 'text-green-400' : 'text-red-400' : 'text-gray-400'}`}>
            {amounts.length > 1 && amounts[0] > 0
              ? `${((amounts[amounts.length - 1] - amounts[0]) / amounts[0] * 100) >= 0 ? '+' : ''}${((amounts[amounts.length - 1] - amounts[0]) / amounts[0] * 100).toFixed(1)}%`
              : amounts.length > 1
                ? `${amounts[amounts.length - 1] > amounts[0] ? '+' : ''}${amounts[amounts.length - 1] - amounts[0] > 0 ? ((amounts[amounts.length - 1] - amounts[0]) / Math.max(amounts[0], 1) * 100).toFixed(1) : '0.0'}%`
                : 'N/A'
            }
          </div>
          <div className="text-xs text-gray-400">
            Trend
          </div>
        </div>
      </div>
    </div>
  );
}
