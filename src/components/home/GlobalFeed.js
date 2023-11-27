import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "./Favorite";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const GlobalFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "https://api.realworld.io/api/articles"
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading articles...</div>
      ) : (
        articles.map((article) => (
          <div key={article.slug} className="article-preview">
            <div className="article-meta">
              {/* Use the simplified Favorite component without API calls */}
              <Favorite
                articleSlug={article.slug} // Ensure that article.slug is defined
                onUpdateFavorite={(updatedArticle) => {
                  console.log("Article updated:", updatedArticle);
                }}
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

export default GlobalFeed;
