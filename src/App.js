import "./style/style.css";
import React, { useState, useEffect } from "react";
import { Routes, BrowserRouter as Router, Route, useNavigate } from "react-router-dom";
import { refreshToken } from "./interceptors/refreshToken";
import { checkToken } from "./interceptors/checkToken";
import UserLayout from "./layouts/UserLayout";
import HomeLayout from "./layouts/HomeLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('userToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      if (checkToken(storedRefreshToken)) {
        window.alert("Your session has expired!");
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        navigate("/login");
        return;
      }
    } else {
      setIsloggedIn(false);
    }
    if (storedAccessToken) {

      if (checkToken(storedAccessToken)) {
        refreshToken();
      }

      setIsloggedIn(true);
    } else {
      setIsloggedIn(false);
    }

    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      setAccessGranted(true);
    }
    validateToken(navigate);
  }, [navigate]);

  const validateToken = (navigate) => {
    const intervalId = setInterval(async () => {
      if (checkToken(localStorage.getItem("refreshToken"))) {
        window.alert("Your session has expired!");
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        navigate("/login");
        return;
      }
      if (checkToken(localStorage.getItem("userToken"))) {
        try {
          await refreshToken();
        } catch (error) {
          console.error("Refresh token error:", error);
        }
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }

  return (
      <>
        <Routes >
          <Route path="/*" element={<HomeLayout />} />
          {isLoggedIn && <Route path="user/*" element={<UserLayout accessGranted={accessGranted}/>} />}        
          <Route path="*" element={<>404</>} />
        </Routes>
        <ToastContainer />
      </>

  );
}

export default App;