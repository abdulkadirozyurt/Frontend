import { useEffect } from 'react'
import Home from '../Screens/Home'
import LoginPage from '../Screens/LoginPage'
import Register from '../Screens/Register'
import ForgotPassword from '../Screens/ForgotPassword';
import DoneforgotPassword from '../Screens/DoneForgotPassword';
import SetPassword from '../Screens/SetPassword';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const HomeLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();
    const bannedRoutes= currentPath.includes("user");
    useEffect(() => {
        if (bannedRoutes && !localStorage.getItem("userToken")) {
            navigate("/home");
            toast("You do not have permission to access this page", {type:"error"})
        }
    },[])
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/forgot-password"
          element={<ForgotPassword />} 
        />
        <Route 
          path="/done-forgot-password" 
          element={<DoneforgotPassword />} 
        />
        <Route 
          path="/set-password/:token" 
          element={<SetPassword />} 
        />
        {/* <Route path="*" element={<>404</>} /> */}
    </Routes>
  )
}

export default HomeLayout