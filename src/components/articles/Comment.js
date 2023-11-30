// Comment.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Comment = ({ comment, onReply, fetchComments }) => {


    return (
        <div key={comment.id} className="comment">
            <p>{comment.body}</p>
            <div className="comment-meta">
                <span>{comment.author.username}</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default Comment;
