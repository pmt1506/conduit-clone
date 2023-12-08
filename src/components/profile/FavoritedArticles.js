// FavoritedArticles.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "../home/Favorite";
import Pagination from "../home/Pagination";
import { BarLoader } from "react-spinners";

const FavoritedArticles = ({
  username,
  isOwnProfile = false,
  authenticatedUser = null,
}) => {
  const [favoritedArticles, setFavoritedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Assuming you have a reasonable value for articlesPerPage
  const articlesPerPage = 10;

  const userToken = localStorage.getItem("userToken");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchFavoritedArticles = async (offset) => {
    try {
      setLoading(true);
      let apiUrl;

      if (isOwnProfile) {
        // If it's your own profile, fetch all favorited articles
        apiUrl = `https://api.realworld.io/api/articles?favorited=${username}&limit=${articlesPerPage}&offset=${offset}`;
      } else {
        // If it's not your profile, fetch only favorited articles of the specific author
        apiUrl = `https://api.realworld.io/api/articles?author=${username}&favorited=${authenticatedUser.username}&limit=${articlesPerPage}&offset=${offset}`;
      }

      const headers = {};

      // If userToken is present, add the Authorization header
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const response = await axios.get(apiUrl, { headers });

      // Filter articles to include only those favorited by the logged-in user
      const userFavoritedArticles = response.data.articles.filter(
        (article) => article.favorited
      );

      setFavoritedArticles(userFavoritedArticles);

      // Calculate total pages based on the total user favorited articles and articles per page
      setTotalPages(Math.ceil(userFavoritedArticles.length / articlesPerPage));
    } catch (error) {
      console.error("Error fetching favorited articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritedArticles(0); // Initial fetch with offset 0
  }, [username, userToken]);

  const handleUpdateFavorite = (updatedArticle) => {
    // Find the index of the updated article in the state
    const updatedIndex = favoritedArticles.findIndex(
      (article) => article.slug === updatedArticle.slug
    );

    if (updatedIndex !== -1) {
      // Update the state with the modified article
      setFavoritedArticles((prevArticles) => {
        const newArticles = [...prevArticles];
        newArticles[updatedIndex] = updatedArticle;
        return newArticles;
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * articlesPerPage;
    setCurrentPage(pageNumber);
    fetchFavoritedArticles(newOffset);
  };

  return (
    <div>
      {loading ? (
        <div className="loading-spinner">
          <BarLoader color={"#36D7B7"} loading={loading} size={150} />
        </div>
      ) : favoritedArticles.length > 0 ? (
        favoritedArticles.map((article) => (
          <div key={article.slug} className="article-preview">
            <div className="article-meta">
              <a href={`/@${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </a>
              <div className="info">
                <a href={`/@${article.author.username}`} className="author">
                  {article.author.username}
                </a>
                <span className="date">{formatDate(article.createdAt)}</span>
              </div>
              <Favorite
                articleSlug={article.slug}
                onUpdateFavorite={handleUpdateFavorite}
                favCount={article.favoritesCount}
              />
            </div>

            <a href={`/article/${article.slug}`} className="preview-link">
              <h1>{article.title}</h1>
              <p>{article.description}</p>
              <div>
                <span>Read more...</span>
                <ul className="tag-list">
                  {article.tagList.map((tag) => (
                    <li key={tag} className="tag-default tag-pill tag-outline">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          </div>
        ))
      ) : (
        <div>No favorited articles found</div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default FavoritedArticles;
