import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const NUM_BOXES = 6;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(() => new Array(NUM_BOXES).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [resetting, setResetting] = useState(false);

  const inputsRef = useRef([]);

  // focus first empty box on mount
  useEffect(() => {
    const i = digits.findIndex((d) => !d);
    if (i >= 0 && inputsRef.current[i]) inputsRef.current[i].focus();
  }, []); // eslint-disable-line

  const otp = digits.join("");

  const sendResetOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      setSending(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data.message || "OTP sent to your email.");
        // focus first box
        if (inputsRef.current[0]) inputsRef.current[0].focus();
      } else {
        toast.error(data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Network error";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const onChangeBox = (idx, valRaw) => {
    const val = (valRaw || "").replace(/\D/g, ""); // digits only
    if (val.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
      return;
    }

    // support pasting multiple digits
    const chars = val.split("");
    setDigits((prev) => {
      const next = [...prev];
      let i = idx;
      for (const c of chars) {
        if (i >= NUM_BOXES) break;
        next[i] = c;
        i += 1;
      }
      // move focus to next empty or last
      const nextIdx = Math.min(
        NUM_BOXES - 1,
        Math.max(
          i,
          next.findIndex((d) => d === "")
        )
      );
      if (inputsRef.current[nextIdx]) inputsRef.current[nextIdx].focus();
      return next;
    });
  };

  const onKeyDownBox = (e, idx) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = "";
          // keep focus here
          return next;
        }
        const prevIdx = Math.max(0, idx - 1);
        next[prevIdx] = "";
        if (inputsRef.current[prevIdx]) inputsRef.current[prevIdx].focus();
        return next;
      });
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = Math.max(0, idx - 1);
      if (inputsRef.current[prevIdx]) inputsRef.current[prevIdx].focus();
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = Math.min(NUM_BOXES - 1, idx + 1);
      if (inputsRef.current[nextIdx]) inputsRef.current[nextIdx].focus();
      return;
    }
  };

  const onPasteBox = (e, idx) => {
    const text = e.clipboardData.getData("text") || "";
    if (!text) return;
    e.preventDefault();
    onChangeBox(idx, text);
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (otp.length !== NUM_BOXES) {
      toast.error(`Enter the ${NUM_BOXES}-digit OTP.`);
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
        navigate("/login");
      } else {
        toast.error(data?.message || "Failed to reset password.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Network error";
      toast.error(msg);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="logo"
      />

      <form
        onSubmit={resetPassword}
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-[28rem] text-indigo-300 text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Reset Password
        </h2>
        <p className="text-center text-indigo-200/70 mb-8">
          Enter your email, request an OTP, then fill the boxes and set a new
          password.
        </p>

        {/* Email */}
        <label className="block text-indigo-200 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email Address"
          required
        />

        <button
          type="button"
          onClick={sendResetOtp}
          disabled={sending || !email}
          className="mb-6 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
        >
          {sending ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* OTP boxes */}
        <label className="block text-indigo-200 mb-2">OTP</label>
        <div className="flex items-center justify-between gap-2 mb-6">
          {Array.from({ length: NUM_BOXES }).map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="\d{1}"
              maxLength={1}
              value={digits[i]}
              onChange={(e) => onChangeBox(i, e.target.value)}
              onKeyDown={(e) => onKeyDownBox(e, i)}
              onPaste={(e) => onPasteBox(e, i)}
              ref={(el) => (inputsRef.current[i] = el)}
              className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {/* New password */}
        <label className="block text-indigo-200 mb-1">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="at least 6 characters"
          required
        />

        <button
          type="submit"
          disabled={resetting}
          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
        >
          {resetting ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-4 flex items-center justify-between text-indigo-300">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="underline hover:text-white"
          >
            Back to login
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("");
              setDigits(new Array(NUM_BOXES).fill(""));
              setNewPassword("");
              if (inputsRef.current[0]) inputsRef.current[0].focus();
            }}
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
