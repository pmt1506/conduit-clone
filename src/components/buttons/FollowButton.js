// FollowButton.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FollowButton = ({ profileUsername = "", onUpdateFollow, pageStyle }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    // Check if the user is logged in before fetching follow status
    if (userToken) {
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
    }
  }, [profileUsername, userToken]);

  const handleFollowToggle = async () => {
    try {
      setIsToggling(true);

      if (!userToken) {
        // If not logged in, navigate to the login page
        window.location.href = "/login";
        return;
      }

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

      // Display toast notification based on follow/unfollow status
      toast.success(`${isFollowing ? "Unfollowed " : "Followed "} ${profileUsername}`);
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
      disabled={isToggling || !userToken} // Disable button if user is not logged in
      style={{
        cursor: isToggling || !userToken ? "not-allowed" : "pointer",
        height: "31px",
        lineHeight: "21px",
        marginLeft: "5px",
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
