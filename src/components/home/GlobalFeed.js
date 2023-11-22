import React from 'react';

const GlobalFeed = ({ articles, loading }) => (
  <div>
    {loading ? (
      <div>Loading articles...</div>
    ) : (articles.map((article) => (
      <div key={article.slug} className="article-preview">
      <div className="article-meta">
        <a href="">
          <img src={article.author.image} alt={article.author.username} />
        </a>
        <div className="info">
          <a href="" className="author">
            {article.author.username}
          </a>
          <span className="date">{article.createdAt}</span>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <a href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </div>
    ))
    )}
  </div>
);

export default GlobalFeed;
