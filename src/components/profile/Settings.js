import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/Settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [profilePictureLink, setProfilePictureLink] = useState(""); // New state for the link
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // New password field

  const navigate = useNavigate();

  // State for update status (success or failure)
  const [updateStatus, setUpdateStatus] = useState({
    success: null,
    message: "",
  });

  useEffect(() => {
    // Update the document title
    document.title = `Setting -- Conduit`;

    // Retrieve the user token from localStorage
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      // If no user token, redirect to login page
      navigate("/login");
      return; // Stop further execution
    }

    if (userToken) {
      // Include the token in the headers of the Axios request
      axios
        .get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          // Set the user state with the fetched data
          setUser(response.data.user);

          // Fill in the form fields with user data
          setProfilePictureLink(response.data.user.image || ""); // New state for the link
          setUsername(response.data.user.username || "");
          setBio(response.data.user.bio || "");
          setEmail(response.data.user.email || "");

          console.log({ userToken });
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "https://api.realworld.io/api/user",
        {
          user: {
            email,
            password: newPassword,
            username,
            bio,
            image: profilePictureLink,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Assuming the API returns a user object with a new token upon successful update
      const updatedUser = response.data.user;
      const newToken = response.data.user.token;

      // Update the user state with the new data
      setUser(updatedUser);

      // Update the token in localStorage with the new token
      localStorage.setItem("userToken", newToken);

      // Display updated user's data to console
      console.log("Updated User:", updatedUser);

      // Optionally, you can display a success message to the user
      console.log("Settings updated successfully!");

      // Set success message in the state
      setUpdateStatus({
        success: true,
        message: "Settings updated successfully!",
      });

      navigate(`/${response.user.username}`);
    } catch (error) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);

      // Set failure message in the state
      setUpdateStatus({
        success: false,
        message: "Failed to update settings. Please try again.",
      });
    }
  };

  const handleLogout = () => {
    // Clear session storage
    localStorage.clear();
    // Redirect to the login page (replace '/login' with the actual path)
    window.location.href = "/";
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="offset-md-3 col-xs-12 setting-container">
            <h1 className="text-center">Settings</h1>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL of profile picture"
                  value={profilePictureLink}
                  onChange={(e) => setProfilePictureLink(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control bio"
                  rows="6"
                  placeholder="Short bio about you"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                {/* New password field */}
                <input
                  type="password"
                  placeholder="New Password"
                  className="form-control form-control-lg"
                  style={{ color: "#55595c", height: "50px", fontSize: "16px" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary float-end btn-setting"
              >
                Update Settings
              </button>
            </form>
            <div
              className="text-center"
              style={{
                marginTop: "90px",
                color: updateStatus.success ? "green" : "red",
              }}
            >
              {updateStatus.message && <span>{updateStatus.message}</span>}
            </div>
            <hr className="mt-3" />
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;