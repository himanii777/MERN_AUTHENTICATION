
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Send OTP to the provided email
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      setSendingOtp(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data.message || "OTP sent to your email.");
      } else {
        toast.error(data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      console.error("sendResetOtp error:", err);
    } finally {
      setSendingOtp(false);
    }
  };

  // Submit OTP + new password to reset
  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      toast.error("Please fill email, OTP and new password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }

    try {
      setResetting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data.message || "Password reset successful.");
        // optionally navigate to login
        navigate("/login");
      } else {
        toast.error(data?.message || "Failed to reset password.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      console.error("resetPassword error:", err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={handleReset}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-indigo-300"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>

        <label className="block text-xs text-gray-300 mb-2">Email</label>
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="flex-1 px-4 py-2 rounded-md bg-[#333A5C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sendingOtp}
            className={`px-4 py-2 rounded-md bg-indigo-600 text-white font-medium ${sendingOtp ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"}`}
          >
            {sendingOtp ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <label className="block text-xs text-gray-300 mb-2">OTP</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
          inputMode="numeric"
          className="w-full px-4 py-2 rounded-md mb-4 bg-[#333A5C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-xs text-gray-300 mb-2">New password</label>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 rounded-md mb-6 bg-[#333A5C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={resetting}
          className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${resetting ? "opacity-60 cursor-not-allowed" : "hover:opacity-95"}`}
        >
          {resetting ? "Resetting..." : "Reset Password"}
        </button>

        <div className="flex items-center justify-between mt-4 text-xs text-gray-300">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="underline hover:text-white"
          >
            Back to Login
          </button>
          <button
            type="button"
            onClick={() => { setEmail(""); setOtp(""); setNewPassword(""); }}
            className="underline hover:text-white"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
