import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Log email and password before making the API call
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post("https://api.realworld.io/api/users/login", {
        user: {
          email,
          password,
        },
      });

      // Assuming the API returns a user object upon successful login
      const user = response.data.user;

      // Store user token in sessionStorage
      sessionStorage.setItem("userToken", user.token);

      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="offset-md-3 col-xs-12 login-body">
          <h1 className="text-center">Sign in</h1>
          <p className="text-center">
            <a href="/register">Need an account?</a>
          </p>
          <form onSubmit={handleLogin}>
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
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
