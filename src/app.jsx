import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
// import Protected from "./Shared/Protected";
import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Pages/HomePage";
import MapPage from "./components/Map/MapPage";
import LocationPermissionComponent from "./components/LocationPermission/LocationPermissionComponent";
import { useState } from "react";
import UserAccount from "./components/Account/UserAccount";
import Protected from "./components/Shared/Protected";
import UpdateUser from "./components/Account/updateUser";
import Logout from "./components/Login/Logout";
import UserFavorite from "./components/Account/Favorites/userFavorite";
import Navigation from "./components/Navigations/Navigations";


function App() {
  const [location, setLocation] = useState(null);

  return (
    <div className="content-overlay">
      <LocationPermissionComponent setLocation={setLocation} />
      <Router>
        <Navigation />
        <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/MapPage" element={<MapPage location={location} />} />
          <Route path="/Account" element={<Protected />} />
          <Route path="/UserAccount" element={<UserAccount />} />
          <Route path="/UpdateUser" element={<UpdateUser />} />
          <Route path="/accountPage" element={<accountPage />} />
          <Route path="/UserFavorites" element={<UserFavorite />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;