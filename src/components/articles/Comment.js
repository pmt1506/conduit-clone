// Comment.js
import React, { useEffect, useState } from "react";
import "../../css/Articles.css";
import axios from "axios";
import toast from "react-hot-toast";

const Comment = ({ comment, fetchComments }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleDeleteComment = async () => {
    try {
      await axios.delete(
        `https://api.realworld.io/api/articles/${comment.articleSlug}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      // After successful deletion, fetch comments again to update the UI
      fetchComments();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  const isCommentDeletable =
    currentUser && currentUser.username === comment.author.username;

  return (
    <div key={comment.id} className="comment-form card">
      <div className="card-block">
        <div className="form-control" rows="3">
          {comment.body}
        </div>
      </div>
      <div className="card-footer">
        {comment.author.image && (
          <a href={`/@${comment.author.username}`}>
            <img
              src={comment.author.image}
              alt={`${comment.author.username}'s image`}
              className="comment-author-img"
            />
          </a>
        )}
        <a href={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </a>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {/* Clickable icon for delete */}
        <span className="mod-options" onClick={handleDeleteComment}>
          {isCommentDeletable && <i className="bi bi-trash3-fill"></i>}
        </span>
      </div>
    </div>
  );
};

export default Comment;
