import React from "react";

const Header = () => {
  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="/">
          conduit
        </a>
        <ul class="nav navbar-nav flex-row ml-auto">
          <li class="nav-item">
            <a class="nav-link active" href="/">
              Home
            </a>
          </li>
          <li class="nav-item" style={{ marginLeft: "1rem" }}>
            <a class="nav-link" href="/login">
              Sign in
            </a>
          </li>
          <li class="nav-item" style={{ marginLeft: "1rem" }}>
            <a class="nav-link" href="/register">
              Sign up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
