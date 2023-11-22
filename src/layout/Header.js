import React, { useState, useEffect } from "react";

const Header = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Get userToken from sessionStorage when the component mounts
    const tokenFromStorage = sessionStorage.getItem("userToken");
    setUserToken(tokenFromStorage);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleLogout = () => {
    // Clear user token from sessionStorage
    sessionStorage.removeItem("userToken");

    // Update component state to reflect logout
    setUserToken(null);
  };

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
          {userToken ? (
            // Display this content when user is logged in
            <>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <a className="nav-link" href="/profile">
                  Profile
                </a>
              </li>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Display this content when user is not logged in
            <>
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
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
