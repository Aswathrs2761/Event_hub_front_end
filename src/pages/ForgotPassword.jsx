import { useState } from "react";
import API from "../api/PathApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await API.post("auth/forgotPassword", { email });

      toast.success("Password reset link sent to your email");
      setEmail("")
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
            Forgot Password
          </h2>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Enter your email to reset your password
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
                value={email}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              onClick={handleForgotPassword}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-200"
            >
              Send Reset Link
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8">
            <p className="text-gray-400 text-center text-sm">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium hover:underline transition-colors"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
