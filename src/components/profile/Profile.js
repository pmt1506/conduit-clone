import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const { username: profileUsername } = useParams();
  const userToken = sessionStorage.getItem("userToken");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = () => {
      if (profileUsername) {
        axios
          .get(`https://api.realworld.io/api/profiles/${profileUsername}`)
          .then((response) => {
            setUser(response.data.profile);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    };

    const fetchAuthenticatedUser = () => {
      if (userToken) {
        axios
          .get("https://api.realworld.io/api/user", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((response) => {
            setAuthenticatedUser(response.data.user);
          })
          .catch((error) => {
            console.error("Error fetching authenticated user data:", error);
          });
      }
    };

    fetchUserProfile();
    fetchAuthenticatedUser();
  }, [profileUsername, userToken]);

  useEffect(() => {
    // Check if the authenticated user is defined and already following the profile user
    if (authenticatedUser && user) {
      setIsFollowing(
        authenticatedUser.following &&
          authenticatedUser.following.includes(user.username)
      );
    }
  }, [authenticatedUser, user]);

  const handleFollowToggle = () => {
    if (userToken) {
      const followEndpoint = `https://api.realworld.io/api/profiles/${profileUsername}/follow`;

      const requestConfig = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      // Toggle follow status
      if (isFollowing) {
        // Unfollow
        axios.delete(followEndpoint, requestConfig).then(() => {
          setIsFollowing(false);
        });
      } else {
        // Follow
        axios.post(followEndpoint, {}, requestConfig).then(() => {
          setIsFollowing(true);
        });
      }
    }
  };

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
                <img src={user.image} alt="#" className="user-img" />
                <h4>{user.username}</h4>
                <p>{user.bio}</p>
                {isFollowing ? (
                  // Render "Unfollow" button
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary action-btn"
                      style={{ float: "right" }}
                      onClick={handleFollowToggle}
                    >
                      <i
                        class="bi bi-x-lg"
                        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                      ></i>
                      Unfollow {profileUsername}
                    </button>
                  </div>
                ) : (
                  // Render "Follow" button
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary action-btn"
                      style={{ float: "right" }}
                      onClick={handleFollowToggle}
                    >
                      <i
                        class="bi bi-plus-lg"
                        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                      ></i>
                      Follow {profileUsername}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
