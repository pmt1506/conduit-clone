// Comment.js
import React, { useEffect, useState } from "react";
import "../../css/Articles.css"
import axios from "axios";

const Comment = ({ comment, onReply, fetchComments }) => {


    return (
        <div key={comment.id} className="card">
            <div class="card-block">
                <div class="form-control" rows="3">{comment.body}</div>
            </div>
            <div class="card-footer">
                {comment.author.image && (
                    <a href={`/${comment.author.username}`}>
                        <img
                            src={comment.author.image}
                            alt={`${comment.author.username}'s image`}
                            className="comment-author-img"
                        />
                    </a>
                )}
                <a href={`/${comment.author.username}`} className="comment-author">
                    {comment.author.username}
                </a>
                <span className="date-posted">{new Date(comment.createdAt).toLocaleDateString()}</span>
                {/* <button>
                    Delete here
                </button> */}
            </div>
        </div>
    );
};

export default Comment;
