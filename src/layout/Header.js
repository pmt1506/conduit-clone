import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav flex-row ml-auto">
          <li className="nav-item">
            <a className="nav-link active" href="/">
              Home
            </a>
          </li>
          <li className="nav-item" style={{ marginLeft: "1rem" }}>
            <a className="nav-link" href="/login">
              Sign in
            </a>
          </li>
          <li className="nav-item" style={{ marginLeft: "1rem" }}>
            <a className="nav-link" href="/register">
              Sign up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
