// Articles_View.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "../buttons/FollowButton";
import FavoriteButton from "../buttons/FavoriteButton";
import { useNavigate } from "react-router-dom";
import "../../css/Articles.css";
import Comment from "./Comment";
import axios from "axios";

const Articles_View = () => {
  const [user, setUser] = useState(null);
  const [article, setArticle] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const isArticleOwner =
    user && userInfo && user.username === userInfo.username;

  const userToken = localStorage.getItem("userToken");
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleResponse = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );
        setArticle(articleResponse.data.article);

        const authorProfileResponse = await axios.get(
          `https://api.realworld.io/api/profiles/${articleResponse.data.article.author.username}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(authorProfileResponse.data.profile);
        setIsFollowing(authorProfileResponse.data.profile.following);

        fetchUserInfo(userToken); //for getting user's image

        fetchComments(); // Move the comment fetching logic here
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug, userToken]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get("https://api.realworld.io/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming the API returns user information
      const userData = response.data.user;

      // Set user information in state
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        { comment: { body: newComment } },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleUpdateFollow = (updatedProfile) => {
    setUser(updatedProfile);
    setIsFollowing(updatedProfile.following);
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setComments(commentsResponse.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDeleteArticle = async () => {
    try {
      await axios.delete(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Redirect or perform additional actions after successful deletion
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
      // Handle error or display a message to the user
    }
  };

  const handleEditArticle = () => {
    // Navigate to the edit article page
    navigate(`/editor/${slug}`);
  };

  if (!article || !user) {
    return <div className="container">Loading...</div>;
  }

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
              <img
                src={article.author.image}
                alt=""
                width="32px"
                height="32px"
              />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              {isArticleOwner ? (
                <span>
                  {/* Add Edit and Delete buttons here */}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleEditArticle}
                    style={{
                      height: "31px",
                      lineHeight: "21px",
                      marginLeft: "5px",
                    }}
                  >
                    <i
                      className="bi bi-pencil"
                      style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                    ></i>
                    Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger ml-2"
                    onClick={handleDeleteArticle}
                    style={{
                      height: "31px",
                      lineHeight: "21px",
                      marginLeft: "5px",
                    }}
                  >
                    <i
                      className="bi bi-trash-fill"
                      style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                    ></i>
                    Delete Article
                  </button>
                </span>
              ) : (
                <span>
                  <FollowButton
                    key={isFollowing ? "following" : "notFollowing"}
                    profileUsername={user.username}
                    onUpdateFollow={handleUpdateFollow}
                    pageStyle="article-button"
                  />
                  <FavoriteButton articleSlug={article.slug} />
                </span>
              )}
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
              <img
                src={article.author.image}
                alt=""
                width="32px"
                height="32px"
              />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              {isArticleOwner ? (
                <span>
                  {/* Add Edit and Delete buttons here */}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleEditArticle}
                    style={{
                      height: "31px",
                      lineHeight: "21px",
                      marginLeft: "5px",
                    }}
                  >
                    <i
                      className="bi bi-pencil"
                      style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                    ></i>
                    Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger ml-2"
                    onClick={handleDeleteArticle}
                    style={{
                      height: "31px",
                      lineHeight: "21px",
                      marginLeft: "5px",
                    }}
                  >
                    <i
                      className="bi bi-trash-fill"
                      style={{ marginRight: "0.2rem", fontSize: "1rem" }}
                    ></i>
                    Delete Article
                  </button>
                </span>
              ) : (
                <span>
                  <FollowButton
                    key={isFollowing ? "following" : "notFollowing"}
                    profileUsername={user.username}
                    onUpdateFollow={handleUpdateFollow}
                    pageStyle="article-button"
                  />
                  <FavoriteButton articleSlug={article.slug} />
                </span>
              )}
            </span>
          </div>
        </div>
        {/* Comment */}
        <div className="row mb-5">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form" onSubmit={handleCommentSubmit}>
              <fieldset>
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                    value={newComment}
                    onChange={handleCommentChange}
                  ></textarea>
                </div>
                <div className="card-footer">
                  {userInfo && userInfo.image && (
                    <img
                      className="comment-author-img"
                      src={userInfo.image}
                      alt="user's image"
                    />
                  )}
                  <button className="btn btn-sm btn-success" type="submit">
                    Post Comment
                  </button>
                </div>
              </fieldset>
            </form>
            <div className="comments">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  fetchComments={fetchComments}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles_View;
