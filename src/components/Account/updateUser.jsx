import { useState, useEffect } from "react";
import { useUpdatesUserMutation } from "../Login/LoginSlice";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigations/Navigations";
import Footer from "../Footer/Footer";
import "./updateUser.css";

export default function UpdateUser() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user2 = window.sessionStorage.getItem("user");
    if (user2) {
      try {
        const user = JSON.parse(user2);
        setUserId(user.id);
        setForm({
          firstName: user.firstName,
          lastName: user.lastName,
          password: "",
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const [updateUser] = useUpdatesUserMutation();

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User ID:", userId);
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    try {
      const response = await updateUser({ id: userId, ...form }).unwrap();
      console.log("User updated successfully", response);
      navigate("/UserAccount");
    } catch (error) {
      console.error("Failed to update user information:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="settings-container">
        <div className="settings-column">
          <h2 className="settings-title">Settings</h2>
        </div>
        <div className="divider"></div>
        <div className="form-column">
          <h2 className="account-tittle">Update account</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  placeholder=" "
                  name="firstName"
                  onChange={updateForm}
                  value={form.firstName}
                  required
                />
                <label className="floating-label" htmlFor="firstName">
                  First Name*
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  placeholder=" "
                  name="lastName"
                  onChange={updateForm}
                  value={form.lastName}
                  required
                />
                <label className="floating-label" htmlFor="lastName">
                  Last Name*
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder=" "
                  name="password"
                  onChange={updateForm}
                  value={form.password}
                  required
                />
                <label className="floating-label" htmlFor="password">
                  New Password*
                </label>
              </div>
            </div>
            <button type="submit" className="update-button">
              Update
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
