import React from 'react';

const Tags = ({ tags, loading, onTagClick }) => (
  <div className="tag-list">
    {loading ? (
      <div>Loading tags...</div>
    ) : (
      tags.map((tag) => (
        <a key={tag} href={`#${tag}`} className="tag-default tag-pill" onClick={() => onTagClick(tag)}>
          {tag}-
        </a>
      ))
    )}
  </div>
);

export default Tags;
