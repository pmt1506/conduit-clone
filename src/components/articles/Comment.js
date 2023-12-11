// Import necessary libraries and components
import React, { useEffect, useState } from "react";
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
      // Start loading toast immediately
      const loadingToast = toast.loading("Deleting...");

      const response = await axios.delete(
        `https://api.realworld.io/api/articles/${comment.articleSlug}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Dismiss the loading toast after a short delay (e.g., 500 milliseconds)
      setTimeout(() => {
        toast.dismiss(loadingToast);

        toast.promise(Promise.resolve(response), {
          success: <b>Comment deleted successfully!</b>,
          error: <b>Error deleting comment</b>,
        });

        // After successful deletion, fetch comments again to update the UI
        fetchComments();
      }, 500); // Adjust the delay as needed
    } catch (error) {
      console.error("Error deleting comment:", error);
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
