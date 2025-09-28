// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // ensure no trailing slash
  const raw = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const backendUrl = raw.replace(/\/+$/, "");

  // ensure axios sends cookies by default
  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("getUserData error:", error);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { withCredentials: true });
      if (data.success) {  // <-- fixed 'sucess' -> 'success'
        setIsLoggedIn(true);
        await getUserData();
      }
    } catch (error) {
      // not fatal, but show useful debug
      console.warn("getAuthState error:", error?.response?.status, error?.response?.data);
    }
  };

  useEffect(() => {
    getAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getAuthState,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
