import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import FollowButton from "../profile/FollowButton";
import "../../css/Articles.css";

const Articles_View = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );
        setArticle(response.data.article);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [slug]);

  if (!article) {
    return <div>Loading...</div>;
  }

  //Format Date
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta_1">
            <a href={`/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              <button className="btn btn-sm btn-secondary">
                <i
                  className="bi bi-plus-lg"
                  style={{ marginRight: "0.4rem", fontSize: "0.75rem" }}
                ></i>
                Follow {article.author.username}
              </button>
              <button className="btn btn-sm btn-outline-danger mx-1">
                <i className="bi bi-suit-heart-fill mx-1"></i>Favorite Article
                (....)
              </button>
            </span>
            {/* IF CURRENT USER IS AUTHOR */}
            <span style={{ display: "none" }}>
              <button>Edit</button>
              <button>Delete</button>
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.body}</p>
            </div>
            <ul className="tag-list">
                {article.tagList.map((tag) => (
                  <li key={tag} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <div className="article-meta_2">
            <a href={`/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              <button className="btn btn-sm btn-outline-secondary">
                <i
                  className="bi bi-plus-lg"
                  style={{ marginRight: "0.4rem", fontSize: "0.75rem" }}
                ></i>
                Follow {article.author.username}
              </button>
              <button className="btn btn-sm btn-outline-danger mx-1">
                <i className="bi bi-suit-heart-fill mx-1"></i>Favorite Article
                (....)
              </button>
            </span>
            {/* IF CURRENT USER IS AUTHOR */}
            <span style={{ display: "none" }}>
              <button>Edit</button>
              <button>Delete</button>
            </span>
          </div>
          {/* Comment Section */}
          <div className="row">
            <div className="col-md-8 offset-md-2">Comment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles_View;
