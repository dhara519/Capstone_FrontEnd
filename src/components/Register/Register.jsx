import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./RegisterSlice";
import "./Register.css";
import { storeToken } from "../Login/LoginSlice";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../Login/LoginSlice";

export default function Register() {
  // Create register and login mutation hooks
  const [registerUser] = useRegisterMutation();
  const [loginUser] = useLoginMutation(); // Create login mutation
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage form inputs
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Update form state when inputs change
  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log("form: ", form); // log form for debugging
      // register the user
      const registerResponse = await registerUser(form).unwrap();
      console.log("registerResponse", registerResponse);
      if (registerResponse) {
        const loginResponse = await loginUser({
          email: form.email,
          password: form.password,
        }).unwrap(); // Log the user in immediately after registration
        if (loginResponse.token) {
          dispatch(storeToken(loginResponse)); // Store the JWT token in Redux store

          // Store user information, including the ID, in sessionStorage
          const user = {
            id: loginResponse.id, // Ensure ID is included
            email: loginResponse.email,
            firstName: loginResponse.firstName,
            lastName: loginResponse.lastName,
          };
          window.sessionStorage.setItem("user", JSON.stringify(user));

          navigate("/UserAccount"); // Navigate to user account page
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="registerPage">
      <div className="signupform">
        <h2>Create an Account</h2>
        <form onSubmit={submit}>
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
                type="email"
                id="email"
                className="form-control"
                placeholder=" "
                name="email"
                onChange={updateForm}
                value={form.email}
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
                type="password"
                id="password"
                className="form-control"
                placeholder=" "
                name="password"
                onChange={updateForm}
                value={form.password}
                required
              />
              <label className="floating-label" htmlFor="password" required>
                Password*
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
