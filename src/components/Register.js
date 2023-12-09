// Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Update the document title
    document.title = `Register -- Conduit`;
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://api.realworld.io/api/users", {
        user: {
          username,
          email,
          password,
        },
      });

      // Assuming the API returns a user object upon successful registration
      const user = response.data.user;

      // Log the registered user
      console.log("Registered user:", user);

      // Clear form fields
      setUsername("");
      setEmail("");
      setPassword("");

      // Clear error message
      setError("");

      // Show success toast
      toast.success("Registration successful! Redirecting to login page...", {
        duration: 3000,
        icon: "🎉",
      });

      // Redirect to login page with email and password as state parameters
      navigate("/login", { state: { email, password } });
    } catch (error) {
      // Handle registration errors

      if (error.response && error.response.status === 422) {
        // Validation errors
        const validationErrors = error.response.data.errors;
        if (validationErrors.email) {
          setError(`Email: ${validationErrors.email[0]}`);
        } else if (validationErrors.username) {
          setError(`Username: ${validationErrors.username[0]}`);
        } else {
          setError("Registration failed. Please check your input.");
        }
      } else {
        // Unexpected errors
        setError("Registration failed. Please try again.");
      }

      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="offset-md-3 col-xs-12 login-body">
          <h1 className="text-center">Sign up</h1>
          <p className="text-center">
            <a
              href="/login"
              style={{ textDecoration: "none", color: "#5CB85C" }}
            >
              Have an account?
            </a>
          </p>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                className="form-control form-control-lg"
                style={{ color: "#55595c" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                className="form-control form-control-lg"
                style={{ color: "#55595c" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="form-control form-control-lg"
                style={{ color: "#55595c" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
