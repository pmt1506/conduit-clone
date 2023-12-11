import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FavoriteButton = ({ articleSlug }) => {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [check, setCheck] = useState(false); // Add a state for re-render check

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${articleSlug}`,
          {
            headers: userToken
              ? { Authorization: `Bearer ${userToken}` }
              : undefined, // Pass undefined if userToken is not available
          }
        );

        // Check if the response contains the expected data structure
        if (
          response.data &&
          response.data.article &&
          response.data.article.favorited !== undefined &&
          response.data.article.favoritesCount !== undefined
        ) {
          // Update favorite status and count after fetching data
          setIsFavoriting(response.data.article.favorited);
          setFavCount(response.data.article.favoritesCount);

          // Log the favorite count
          console.log("Favorite Count:", response.data.article.favoritesCount);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);

        // Handle the error, set default values, or redirect to login if necessary
        setIsFavoriting(false);
        setFavCount(0);
      }
    };

    fetchFavoriteStatus();
  }, [articleSlug, userToken, check]); // Include check variable in dependencies

  const handleFavoriteToggle = async () => {
    try {
      setIsToggling(true);

      if (!userToken) {
        // If not logged in, navigate to the login page
        window.location.href = "/login";
        return;
      }

      const toastPromise = toast.promise(
        async () => {
          if (isFavoriting) {
            // If already favorited, perform unfavorite using DELETE
            await axios.delete(
              `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
          } else {
            // If not favorited, perform favorite using POST
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

          // Fetch updated data after the toggle
          const response = await axios.get(
            `https://api.realworld.io/api/articles/${articleSlug}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          // Update favorite status and count after the toggle
          setIsFavoriting(response.data.article.favorited);
          setFavCount(response.data.article.favoritesCount);
          setCheck(!check); // Toggle the check variable to trigger re-render

          // Display toast notification based on favorited/unfavorited status
          return `${
            response.data.article.favorited
              ? "Article Favorited!"
              : "Article Unfavorited!"
          }`;
        },
        {
          loading: "Toggling favorite...",
          success: (message) => ({
            content: message,
            icon: `${isFavoriting ? "❤️" : "💔"}`,
          }),
          error: "Error toggling favorite",
        }
      );

      await toastPromise();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        isFavoriting ? "btn-danger" : "btn-outline-danger"
      } article-button`}
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
        className={`bi ${
          isFavoriting ? "bi-suit-heart-fill" : "bi-suit-heart"
        }`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {isFavoriting ? "Unfavorite" : "Favorite"} ({favCount})
    </button>
  );
};

export default FavoriteButton;
