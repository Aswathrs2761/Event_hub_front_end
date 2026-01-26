import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/PathApi";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!form.email || !form.password) {
        toast.error("Please enter email and password");
        return;
      }

      if (!form.email.includes("@")) {
        toast.error("Please enter a valid email");
        return;
      }

      console.log("🔐 Attempting login with:", { email: form.email, password: "****" });
      
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password
      });

      console.log("✅ Login successful:", res.data);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      toast.success("Login successful! Redirecting...");
      navigate("/Events");
    } catch (err) {
      console.error("❌ Login error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        error: err.response?.data?.error,
        details: err.response?.data
      });

      // Handle specific errors
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 404) {
        toast.error("User not found. Please register first");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later");
      } else if (err.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Is backend running at http://localhost:5000?");
      } else {
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f14] via-[#111118] to-[#09090d] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] rounded-3xl shadow-2xl p-8 border border-purple-500/20 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold text-2xl rounded-2xl px-6 py-3 shadow-lg">
              EH
            </div>
          </div>

          {/* Title */}
          <h2 className="text-white text-3xl font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Sign in to continue to EventHub
          </p>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  autoComplete="off"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 space-y-3">
            <p className="text-gray-400 text-center text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium hover:underline transition-colors"
              >
                Sign Up
              </span>
            </p>
            <p className="text-gray-400 text-center text-sm">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
