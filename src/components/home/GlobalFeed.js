import React from "react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const GlobalFeed = ({ articles, loading }) => (
  <div>
    {loading ? (
      <div>Loading articles...</div>
    ) : (
      articles.map((article) => (
        <div key={article.slug} className="article-preview">
          <div className="article-meta">
            <a href="">
              <img src={article.author.image} alt={article.author.username} />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`} className="author">
                {article.author.username}
              </a>
              <span className="date">{formatDate(article.createdAt)}</span>
            </div>
            <button className="btn btn-outline-danger btn-sm pull-xs-right">
              <i className="bi bi-suit-heart-fill mx-1"></i>
              {article.favoritesCount}
            </button>
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

export default GlobalFeed;
