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
import SellProduct from "./pages/SellProductPage/SellProduct";
import Home from "./pages/HomePage/Home";
import ConsultDoctor from "./pages/ConsultDoctorPage/ConsultDoctor";
import UpdateProduct from "./pages/UpdateProductPage/UpdateProdut";
import Details from "./pages/DetailsPage/Details";
import Cart from "./pages/CartPage/Cart";
import Blog from "./pages/BlogPage/Blog";
import WriteBlog from "./pages/WriteBlogPage/WriteBlog";
import CheckOut from "./pages/CheckOutPage/CheckOut";
import ShowOrder from "./pages/ShowOrderPage/ShowOrder";
import GiveAdopt from "./pages/GiveAdoptPage/GiveAdopt";
import Adoption from "./pages/AdoptionPage/Adoption";
import ManageAdopt from "./pages/ManageAdopt/ManageAdopt";
import QuestionAnswer from "./pages/QuestionAnswerPage/QuestionAnswer";
import AdminHome from "./pages/AdminPage/AdminHomePage/AdminHome";
import AdminLogin from "./pages/AdminPage/AdminLoginPage/AdminLogin";

const RouterConfig = () => {
  return (
    <Router>
      <CustomToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellProduct" element={<SellProduct />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
        <Route path="/consultDoctor" element={<ConsultDoctor />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/writeBlog" element={<WriteBlog />} />
        <Route path="/checkOut" element={<CheckOut />} />
        <Route path="/showOrder" element={<ShowOrder />} />
        <Route path="/giveAdopt" element={<GiveAdopt />} />
        <Route path="/adoption" element={<Adoption />} />
        <Route path="/manageAdopt" element={<ManageAdopt />} />
        <Route path="/qa" element={<QuestionAnswer />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default RouterConfig;
