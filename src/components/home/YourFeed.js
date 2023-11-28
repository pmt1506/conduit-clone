import React, { useEffect, useState } from "react";
import axios from "axios";
import Favorite from "./Favorite";

const YourFeed = ({ loading }) => {
  const [yourFeedArticles, setYourFeedArticles] = useState([]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchYourFeedArticles = async () => {
      try {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          // User is not logged in, do not fetch Your Feed articles
          return;
        }

        const response = await axios.get(
          "https://api.realworld.io/api/articles/feed",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(response.data.articles); 

        setYourFeedArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching Your Feed articles:", error);
      }
    };

    fetchYourFeedArticles();
  }, []);

  const handleUpdateFavorite = async (updatedArticle) => {
    const userToken = localStorage.getItem("userToken");
  
    try {
      // Find the index of the updated article in the state
      const updatedIndex = yourFeedArticles.findIndex(
        (article) => article.slug === updatedArticle.slug
      );
  
      if (updatedIndex !== -1) {
        // Update the state optimistically
        setYourFeedArticles((prevArticles) => {
          const newArticles = [...prevArticles];
          newArticles[updatedIndex] = {
            ...prevArticles[updatedIndex],
            favorited: updatedArticle.favorited,
            favoritesCount: updatedArticle.favoritesCount,
          };
          return newArticles;
        });
  
        // Send a request to update the favorite status on the server
        await axios.post(
          `https://api.realworld.io/api/articles/${updatedArticle.slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
  
        // Fetch the updated article after the request to get the latest data
        const response = await axios.get(`https://api.realworld.io/api/articles/${updatedArticle.slug}`);
  
        // Update the state with the actual response from the server
        setYourFeedArticles((prevArticles) => {
          const newArticles = [...prevArticles];
          newArticles[updatedIndex] = response.data.article;
          return newArticles;
        });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };
  

  return (
    <div>
      {loading ? (
        <div>Loading articles...</div>
      ) : (
        yourFeedArticles.map((article) => (
          <div key={article.slug} className="article-preview">
            <div className="article-meta">
              <a href={`/${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </a>
              <div className="info">
                <a href={`/${article.author.username}`} className="author">
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
      )}
    </div>
  );
};

export default YourFeed;
