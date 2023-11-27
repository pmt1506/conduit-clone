// FavoriteButton.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FavoriteButton = ({ articleSlug, onUpdateFavorite, favCount }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${articleSlug}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setIsFavorited(response.data.article.favorited);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [articleSlug, userToken]);

  const handleFavoriteToggle = async () => {
    try {
      setIsToggling(true);

      if (isFavorited) {
        await axios.delete(
          `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }

      // Update favorite status after the toggle
      const response = await axios.get(
        `https://api.realworld.io/api/articles/${articleSlug}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      onUpdateFavorite(response.data.article);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        isFavorited ? "btn-danger" : "btn-outline-danger"
      }`}
      onClick={handleFavoriteToggle}
      disabled={isToggling}
      style={{
        cursor: isToggling ? "not-allowed" : "pointer",
        height: "31px",
        lineHeight: "21px",
        marginLeft: "5px",
      }}
    >
      <i
        className={`bi ${isFavorited ? "bi-suit-heart-fill" : "bi-suit-heart"}`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {isFavorited ? "Unfavorite" : "Favorite"} ({favCount})
    </button>
  );
};

export default FavoriteButton;
