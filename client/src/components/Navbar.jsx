import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IconMail = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8.5l8.5 5L20 8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLogout = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = (delay = 120) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    return () => cancelClose();
  }, []);

  const toggleOpen = () => {
    cancelClose();
    setOpen((v) => !v);
  };
  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };

  const onLogout = async () => {
    try {
      // call backend logout to clear cookie/session
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("logout error:", err?.response?.data || err.message);
    } finally {
      // close menu first so it doesn't linger, clear client state, then go home
      setOpen(false);
      setUserData(null);
      setIsLoggedIn(false);
      navigate("/");      // <-- navigate to home (not /login)
    }
  };

  const onVerifyEmail = () => {
    setOpen(false);
    navigate("/email-verify");
  };

  const keyActivate = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      <img src={assets.logo} className="w-28 sm:w-32" alt="logo" />

      {userData ? (
        <div
          className="relative"
          onMouseEnter={openMenu}
          onMouseLeave={() => scheduleClose(120)}
        >
          <div
            onClick={toggleOpen}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold cursor-pointer select-none"
            aria-haspopup="true"
            aria-expanded={open}
            title={userData?.name}
          >
            {userData?.name?.[0]?.toUpperCase() ?? "U"}
          </div>

          {open && (
            <div
              className="absolute top-full right-0 mt-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 pointer-events-auto"
              onMouseEnter={cancelClose}
              onMouseLeave={() => scheduleClose(120)}
              role="menu"
              aria-label="Account menu"
            >
              <ul className="text-gray-800 text-sm">
                <li
                  role="menuitem"
                  tabIndex={0}
                  onClick={onVerifyEmail}
                  onKeyDown={(e) => keyActivate(e, onVerifyEmail)}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-600">
                      <IconMail />
                    </span>
                    <div>
                      <div className="font-medium">Verify email</div>
                      <div className="text-xs text-gray-500">Confirm your address</div>
                    </div>
                  </div>

                  <div>
                    {userData?.isVerified ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Not verified</span>
                    )}
                  </div>
                </li>

                <li className="border-t border-gray-100" />

                <li
                  role="menuitem"
                  tabIndex={0}
                  onClick={onLogout}
                  onKeyDown={(e) => keyActivate(e, onLogout)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 cursor-pointer"
                >
                  <span className="text-gray-600">
                    <IconLogout />
                  </span>
                  <div className="font-medium">Logout</div>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
