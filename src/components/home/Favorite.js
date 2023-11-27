import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure this import is present

const Favorite = ({ articleSlug, onUpdateFavorite, favCount }) => {
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
  
      // Simulate API calls
      await axios.delete(`https://api.realworld.io/api/articles/${articleSlug}/favorite`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      await axios.post(`https://api.realworld.io/api/articles/${articleSlug}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      // Simulate updating the favorite status after the toggle
      const updatedFavCount = isFavorited ? favCount - 1 : favCount + 1;
  
      // Trigger the update in the parent component
      onUpdateFavorite({
        favorited: !isFavorited,
        favoritesCount: updatedFavCount,
      });
  
      // Update local state
      setIsFavorited(!isFavorited);
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
      }}
    >
      <i
        className={`bi ${isFavorited ? "bi-suit-heart-fill" : "bi-suit-heart"}`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {favCount}
    </button>
  );
};

export default Favorite;
