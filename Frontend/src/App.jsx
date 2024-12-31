import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import RegisterOptions from "./Auth/RegisterOptions";
import RegisterAdmin from "./Auth/RegisterAdmin/RegisterAdmin";
import RegisterUser from "./Auth/RegisterUser/RegisterUser";
import AdminLogin from "./Auth/AdminLogin/AdminLogin";
import UserLogin from "./Auth/UserLogin/UserLogin";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Profile from "./Profile/Profile";
import UpdateProfile from "./Profile/updateProfile";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Playlist from "./Playlist/Playlist";
import FavouritePlaylist from "./FavouritePlaylist/FavouritePlaylist";
import Courses from "./Courses/Course";
import Teachers from "./Teachers/Teachers";
import Users from "./Users/Users";
// Import the UserContextProvider
import UserContextProvider from "../UserContextProvider";

function AppContent() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const location = useLocation();

  // Check if the current route is "/"
  const isRegisterRoute = ["/", "/register-admin", "/register-user", "/admin-login","/user-login"].includes(location.pathname);


  return (
    <>
      {/* Render Header, Sidebar, and Footer only if not on the RegisterOptions route */}
      {!isRegisterRoute && <Header toggleSidebar={toggleSidebar} />}
      {!isRegisterRoute && isSidebarVisible && <Sidebar />}
      <Routes>
        <Route path="/" element={<RegisterOptions />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/favorite-playlist" element={<FavouritePlaylist />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!isRegisterRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserContextProvider>
      <Router>
        <AppContent />
      </Router>
    </UserContextProvider>
  );
}

export default App;
