import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./LoginSlice";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      let success = await login(form).unwrap();
      if (success === "Invalid login credentials.") {
        alert(success);
      } else if (success) {
        navigate("/UserAccount");
      }
      console.log(success);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <div className="input-container">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder=" "
                name="email"
                value={form.email}
                onChange={updateForm}
                required
              />
              <label className="floating-label" htmlFor="email">
                Email*
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder=" "
                name="password"
                value={form.password}
                onChange={updateForm}
                required
              />
              <label className="floating-label" htmlFor="password">
                Password*
              </label>
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <span className="signup-link">
            {"Don't have an account? "} <a href="/Register">Sign Up</a>
          </span>
        </form>
      </div>
    </div>
  );
}
