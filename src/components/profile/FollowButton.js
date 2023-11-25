// FollowButton.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ profileUsername, onUpdateFollow, pageStyle }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/profiles/${profileUsername}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setIsFollowing(response.data.profile.following);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [profileUsername, userToken]);

  const handleFollowToggle = async () => {
    try {
      setIsToggling(true);

      if (isFollowing) {
        // If already following, perform unfollow using DELETE
        await axios.delete(
          `https://api.realworld.io/api/profiles/${profileUsername}/follow`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      } else {
        // If not following, perform follow using POST
        await axios.post(
          `https://api.realworld.io/api/profiles/${profileUsername}/follow`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }

      // Update follow status after the toggle
      const response = await axios.get(
        `https://api.realworld.io/api/profiles/${profileUsername}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      onUpdateFollow(response.data.profile);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        isFollowing ? "btn-secondary" : "btn-outline-secondary"
      } ${pageStyle}`}
      onClick={handleFollowToggle}
      disabled={isToggling}
      style={{
        cursor: isToggling ? "not-allowed" : "pointer",
        height: "31px",
        lineHeight: "21px", // Set the desired lineHeight
      }}
    >
      <i
        className={`bi ${isFollowing ? "bi-x-lg" : "bi-plus-lg"}`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {isFollowing ? "Unfollow" : "Follow"} {profileUsername}
    </button>
  );
};

export default FollowButton;
