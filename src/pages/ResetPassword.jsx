import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/PathApi";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post(`auth/resetPassword/${id}/${token}`, {
        password,
      });

      toast.success("Password reset successfully");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link expired or invalid");
    } finally {
      setLoading(false);
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
            Reset Password
          </h2>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Enter and confirm your new password
          </p>

          {/* Form */}
          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Reset Password Button */}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8">
            <p className="text-gray-400 text-center text-sm">
              Back to{" "}
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
