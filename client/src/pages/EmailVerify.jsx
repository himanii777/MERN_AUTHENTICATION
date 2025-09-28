import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const NUM_BOXES = 6;

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, getUserData, setUserData } = useContext(AppContext);

  // otp digits stored as array of strings ("" or "0"-"9")
  const [digits, setDigits] = useState(() => new Array(NUM_BOXES).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // helper: focus an input (safe)
  const focusInput = (idx) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  // change handler for a single box
  const handleChange = (e, idx) => {
    const raw = e.target.value;
    const onlyDigit = raw.replace(/\D/g, "");
    if (!onlyDigit) {
      // cleared input
      setDigits((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
      return;
    }
    // use first digit
    const d = onlyDigit[0];
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = d;
      return next;
    });
    // move focus to next
    if (idx < NUM_BOXES - 1) {
      focusInput(idx + 1);
    } else {
      // last box: blur (optional)
      inputsRef.current[idx]?.blur();
    }
  };

  // keydown handler for navigation/backspace
  const handleKeyDown = (e, idx) => {
    const key = e.key;
    if (key === "Backspace") {
      e.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        if (next[idx]) {
          // clear current
          next[idx] = "";
          // keep focus on current
          return next;
        } else {
          // move to previous and clear it
          const prevIdx = idx - 1;
          if (prevIdx >= 0) {
            next[prevIdx] = "";
            focusInput(prevIdx);
          }
          return next;
        }
      });
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusInput(idx - 1);
    } else if (key === "ArrowRight") {
      e.preventDefault();
      if (idx < NUM_BOXES - 1) focusInput(idx + 1);
    } else if (key === "Enter") {
      // optional: submit on Enter from any box
      // trigger form submit by blurring last input
      inputsRef.current[idx]?.blur();
    }
  };

  // paste handler: fill digits starting from current index
  const handlePaste = (e, startIdx) => {
    e.preventDefault();
    const clipboard = (e.clipboardData || window.clipboardData).getData("text");
    const onlyDigits = clipboard.replace(/\D/g, "");
    if (!onlyDigits) return;
    setDigits((prev) => {
      const next = [...prev];
      let i = 0;
      for (let j = startIdx; j < NUM_BOXES && i < onlyDigits.length; j++, i++) {
        next[j] = onlyDigits[i];
      }
      // if paste started at 0 and has >=N digits, fill subsequent
      // after set, focus the box after last filled
      const lastFilled = Math.min(NUM_BOXES - 1, startIdx + onlyDigits.length - 1);
      setTimeout(() => focusInput(lastFilled + 1 <= NUM_BOXES - 1 ? lastFilled + 1 : lastFilled), 0);
      return next;
    });
  };

  const buildOtpString = () => digits.join("");

  const submitVerify = async (e) => {
    e.preventDefault();
    const otp = buildOtpString();
    if (!otp || otp.length < 4) {
      toast.error("Please enter the OTP (at least 4 digits).");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (data?.success) {
        toast.success(data.message || "Email verified!");
        // try to refresh user data; fallback to optimistic update if needed
        let updated = null;
        if (getUserData) {
          updated = await getUserData();
        }
        if (!updated && setUserData) {
          setUserData((prev) => ({ ...(prev || {}), isVerified: true }));
        }
        navigate("/");
      } else {
        toast.error(data?.message || "Verification failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      console.error("verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success(data.message || "OTP resent to your email");
        // optionally clear boxes
        setDigits(new Array(NUM_BOXES).fill(""));
        focusInput(0);
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      console.error("resend error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  // focus first input on mount
  useEffect(() => {
    setTimeout(() => focusInput(0), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={submitVerify}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm text-indigo-300"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify — OTP
        </h1>

        <p className="text-gray-300 mb-6">Enter the 4–6 digit code we sent to your email address.</p>

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: NUM_BOXES }).map((_, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              value={digits[idx]}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={(e) => handlePaste(e, idx)}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              aria-label={`OTP digit ${idx + 1}`}
              className="w-12 h-12 text-center text-lg font-medium bg-[#333A5C] text-white rounded-lg border border-transparent focus:border-indigo-400 focus:outline-none shadow-sm"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="flex items-center justify-between mt-4 text-xs text-gray-300">
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendLoading}
            className={`underline ${resendLoading ? "opacity-60 cursor-not-allowed" : "hover:text-white"}`}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="underline hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerify;
