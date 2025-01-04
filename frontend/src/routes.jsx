import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register"
import CustomToastContainer from "./components/ToastContainer";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPassword";
import Authentication from "./pages/AuthenticationPage/Authentication";
import ResetPassword from "./pages/ResetPasswordPage/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import Profile from "./pages/ProfilePage/Profile";
import EditProfile from "./pages/EditProfilePage/EditProfile";
import SellProduct from "./pages/SellProductPage/SellProduct";

const RouterConfig = () => {
  return (
    <Router>
      <CustomToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/sellProduct" element={<SellProduct />} />
      </Routes>
    </Router>
  );
};

export default RouterConfig;
