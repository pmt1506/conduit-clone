import React from "react";
import { PulseLoader } from "react-spinners";

const Tags = ({ tags, loading, onTagClick }) => (
  <div className="tag-list">
    {loading ? (
      <div className="spinner">
        <PulseLoader color={"#36D7B7"} loading={loading} size={15} />
      </div>
    ) : (
      tags.map((tag) => (
        <a
          key={tag}
          href={`#${tag}`}
          className="tag-default tag-pill"
          onClick={() => onTagClick(tag)}
          style={{ textDecoration: "none" }}
        >
          {tag}
        </a>
      ))
    )}
  </div>
);

export default Tags;
