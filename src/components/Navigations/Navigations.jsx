import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { selectIsLoggedIn, clearToken } from "../Login/LoginSlice";
import "./Navigations.css";

function Navigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="links-container">
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Reviews</Link>
            </li>
            <li>
              <Link to="/">Contact</Link>
            </li>
            <li>
              <Link to="/MapPage" className="find">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Find a restaurant
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  onClick={toggleDropdown}
                >
                  <FontAwesomeIcon icon={faUser} /> Account{" "}
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/UserAccount">
                      Personal Info
                    </Link>
                    <Link className="dropdown-item" to="/UserFavorites">
                      My Favorites
                    </Link>
                    <Link className="dropdown-item" to="/UpdateUser">
                      Settings
                    </Link>
                    <div className="dropdown-item" onClick={handleLogout}>
                      Sign Out
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Log in</Link>
                </li>
                <li>
                  <Link to="/register">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
