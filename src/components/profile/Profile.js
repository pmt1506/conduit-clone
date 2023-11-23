import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const userToken = sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!userToken) {
      // If no user token, you might want to handle it accordingly
      // For now, just return or redirect to login page
      return;
    }

    // Fetch user data based on the username parameter and userToken
    axios
      .get(`https://api.realworld.io/api/user`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        // Set the user state with the fetched data
        setUser(response.data.user);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching user data:", error);
      });
  }, [userToken]); // Include userToken in the dependency array

  return (
    <div className="profile-page">
      {/* User's basic info & action buttons  */}
      <div className="user-info">
        <div className="container">
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {user && (
              <>
                <img
                  src={user.image}
                  alt="#"
                  className="user-img"
                />
                <h4>{user.username}</h4>
                <p>{user.bio}</p>
                <div>
                  <a
                    href="/settings"
                    className="btn btn-sm btn-outline-secondary action-btn"
                    style={{ float: "right" }}
                  >
                    <i
                      className="bi bi-gear"
                      style={{ marginRight: "0.15rem" }}
                    ></i>
                    Edit Profile Settings
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
