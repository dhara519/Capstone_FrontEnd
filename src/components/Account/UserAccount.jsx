import { useNavigate } from "react-router-dom";
import "./UserAccount.css";
import Footer from "../Footer/Footer";
import Navigation from "../Navigations/Navigations";

const Account = () => {
  const navigate = useNavigate();
  const user2 = window.sessionStorage.getItem("user");
  const user = JSON.parse(user2);

  return (
    <div className="accountPage">
      <Navigation />
      <div className="account-container">
        <div className="divider"></div>
        <div className="account-information">
          <div className="fAccount-container">
            <h2>Glad to see you {user.firstName}!</h2>
            <h3 className="account-tittle">Account Details</h3>
            <p> First name: {user.firstName}</p>
            <p> Last name: {user.lastName} </p>
            <p> E-mail: {user.email} </p>
            <button
              type="submit"
              className="account-button"
              onClick={() => navigate("/UpdateUser", { state: { user } })}
            >
              Update Information
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
