// Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../css/Profile.css";
import FollowButton from "../buttons/FollowButton";

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

  useEffect(() => {
    console.log("Is my own profile: ", isOwnProfile);
  }, [isOwnProfile]);

  const handleUpdateFollow = (updatedProfile) => {
    setUser(updatedProfile);
    setIsFollowing(updatedProfile.following);
  };

  useEffect(() => {
    console.log("Following: ", isFollowing);
  }, [isFollowing]);

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
                    <FollowButton
                      key={isFollowing ? "following" : "notFollowing"}
                      profileUsername={user.username}
                      // userToken={userToken}
                      isFollowing={isFollowing}
                      onUpdateFollow={handleUpdateFollow}
                      pageStyle="profile-button"
                    />
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
