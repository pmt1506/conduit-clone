// Tags.js
import React from 'react';

const Tags = ({ tags, loading }) => (
  <div className="tag-list">
    {loading ? (
      <div>Loading tags...</div>
    ) : (
      tags.map((tag) => (
        <a key={tag} href={`#${tag}`} className="tag-default tag-pill">
          {tag}-
        </a>
      ))
    )}
  </div>
);

export default Tags;
