// Articles_View.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "../buttons/FollowButton";
import FavoriteButton from "../buttons/FavoriteButton";
import { useNavigate } from "react-router-dom";
import "../../css/Articles.css";
import Comment from "./Comment";
import axios from "axios";
import { BarLoader, PuffLoader } from "react-spinners";
import toast from "react-hot-toast";

const Articles_View = () => {
  const [user, setUser] = useState(null);
  const [article, setArticle] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [loading, setLoading] = useState(true); // Add loading state
  const [commentsLoading, setCommentsLoading] = useState(true); // Add loading state for comments

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
        console.log("Article Data:", articleResponse.data.article);
        setArticle(articleResponse.data.article);

        if (userToken) {
          const authorProfileResponse = await axios.get(
            `https://api.realworld.io/api/profiles/${articleResponse.data.article.author.username}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          console.log(
            "Author Profile Data:",
            authorProfileResponse.data.profile
          );
          setUser(authorProfileResponse.data.profile);
          setIsFollowing(authorProfileResponse.data.profile.following);

          fetchUserInfo(userToken); //for getting user's image

          fetchComments(); // Move the comment fetching logic here
        } else {
          console.log("User not logged in. Skipping user-specific requests.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false after fetch is complete
        setLoading(false);
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
    } finally {
      // Set comments loading to false after comment fetch is complete
      setCommentsLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      await axios.delete(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Redirect or perform additional actions after successful deletion
      navigate("/");

      // Show success toast
      toast.success("Article deleted successfully!");
    } catch (error) {
      console.error("Error deleting article:", error);

      // Show error toast
      toast.error("Failed to delete article. Please try again.");
    }
  };

  const handleEditArticle = () => {
    // Navigate to the edit article page
    navigate(`/editor/${slug}`);
  };

  const formattedDate = article
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="article-page">
      {loading ? (
        <div className="loading-spinner">
          <PuffLoader color={"#36D7B7"} loading={loading} size={150} />
        </div>
      ) : (
        <div>
          <div className="banner">
            <div className="container">
              <h1>{article?.title}</h1>
              <div className="article-meta_1">
                <a href={`/@${article?.author?.username}`}>
                  <img
                    src={article?.author?.image}
                    alt=""
                    width="32px"
                    height="32px"
                  />
                </a>
                <div className="info">
                  <a href={`/@${article?.author?.username}`}>
                    {article?.author?.username}
                  </a>
                  <span className="date">{formattedDate}</span>
                </div>
                <span>
                  {isArticleOwner ? (
                    <span>
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
                        profileUsername={article?.author?.username}
                        onUpdateFollow={handleUpdateFollow}
                        pageStyle="article-button"
                      />
                      <FavoriteButton articleSlug={article?.slug} />
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
                  <p>{article?.body}</p>
                </div>
                <ul className="tag-list">
                  {article?.tagList.map((tag) => (
                    <li key={tag} className="tag-default tag-pill tag-outline">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr />
            {/* Comment */}
            <div className="row mb-5">
              <div className="col-xs-12 col-md-8 offset-md-2">
                {userToken ? (
                  <>
                    <form
                      className="card comment-form"
                      onSubmit={handleCommentSubmit}
                    >
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
                          <button
                            className="btn btn-sm btn-success"
                            type="submit"
                          >
                            Post Comment
                          </button>
                        </div>
                      </fieldset>
                    </form>
                    {commentsLoading ? (
                      <div
                        className="spinner"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "10vh",
                        }}
                      >
                        <BarLoader
                          color={"#36D7B7"}
                          loading={commentsLoading}
                          width={300}
                        />
                      </div>
                    ) : (
                      <div className="comments mt-4">
                        {comments.map((comment) => (
                          <Comment
                            key={comment.id}
                            comment={comment}
                            fetchComments={fetchComments}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="alert alert-info" role="alert">
                    <a href="/login">Login</a> or{" "}
                    <a href="/register">Sign up </a>
                    to see and post comments.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles_View;
