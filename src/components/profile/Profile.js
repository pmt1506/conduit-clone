import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { username: profileUsername } = useParams();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/profiles/${profileUsername}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(response.data.profile);
        setIsFollowing(response.data.profile.following);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchAuthenticatedUser = async () => {
      try {
        const response = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setAuthenticatedUser(response.data.user);
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };

    fetchProfileData();
    fetchAuthenticatedUser();
  }, [profileUsername, userToken]);

  const isOwnProfile =
    authenticatedUser && user && authenticatedUser.username === user.username;

  const handleToggleFollow = async () => {
    try {
      const response = isFollowing
        ? await axios.delete(
            `https://api.realworld.io/api/profiles/${profileUsername}/follow`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
        : await axios.post(
            `https://api.realworld.io/api/profiles/${profileUsername}/follow`,
            {},
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

      setUser(response.data.profile);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="profile-page">
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
                {!isOwnProfile && (
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary action-btn"
                      style={{ float: "right", marginRight: "10px" }}
                      onClick={handleToggleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <i
                            className="bi bi-x-lg"
                            style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                          ></i>
                          Unfollow {user.username}
                        </>
                      ) : (
                        <>
                          <i
                            className="bi bi-plus-lg"
                            style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                          ></i>
                          Follow {user.username}
                        </>
                      )}
                    </button>
                  </div>
                )}
                {isOwnProfile && (
                  <div>
                    <a
                      href="/settings"
                      className="btn btn-sm btn-outline-secondary action-btn"
                      style={{ float: "right", marginRight: "10px" }}
                    >
                      <i
                        className="bi bi-gear"
                        style={{ marginRight: "0.15rem" }}
                      ></i>
                      Edit Profile Settings
                    </a>
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
