// FollowButton.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const FollowButton = ({
  profileUsername,
  userToken,
  isFollowing,
  onUpdateFollow,
  buttonClass,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // You can add any additional logic here if needed when the component mounts or the dependencies change.
  }, [isFollowing]);

  const handleToggleFollow = async () => {
    try {
      setLoading(true);

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

      onUpdateFollow(response.data.profile);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={`btn btn-sm ${buttonClass} action-btn`}
        style={{ float: "right", marginRight: "10px" }}
        onClick={handleToggleFollow}
        disabled={loading}
      >
        {isFollowing ? (
          <>
            <i
              className="bi bi-x-lg"
              style={{ marginRight: "0.2rem", fontSize: "1rem" }}
            ></i>
            Unfollow {profileUsername}
          </>
        ) : (
          <>
            <i
              className="bi bi-plus-lg"
              style={{ marginRight: "0.2rem", fontSize: "1rem" }}
            ></i>
            Follow {profileUsername}
          </>
        )}
      </button>
    </div>
  );
};

export default FollowButton;
