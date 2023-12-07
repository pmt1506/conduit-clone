import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/Create_Articles.css";

const Create_Articles = () => {
  const userToken = localStorage.getItem("userToken") || "";
  const navigate = useNavigate(); // Initialize navigate

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    body: "",
    tags: "",
  });

  const [tagList, setTagList] = useState([]); // Added state for tagList

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleKeyDown = (e) => {
    // If the pressed key is Enter and the tags input is not empty
    if (e.key === "Enter" && articleData.tags.trim() !== "") {
      e.preventDefault(); // Prevents the default behavior of the Enter key (form submission)

      // Check for duplicate tags before adding
      if (!tagList.includes(articleData.tags.trim())) {
        // Update tagList state
        setTagList((prevTagList) => [...prevTagList, articleData.tags.trim()]);
      }

      // Clear the tags input
      setArticleData((prevData) => ({ ...prevData, tags: "" }));
    }
  };

  const removeTag = (tagToRemove) => {
    // Remove the tag from tagList state
    setTagList((prevTagList) =>
      prevTagList.filter((tag) => tag !== tagToRemove)
    );
  };

  const handlePublishArticle = async () => {
    try {
      const response = await axios.post(
        "https://api.realworld.io/api/articles",
        {
          article: {
            title: articleData.title,
            description: articleData.description,
            body: articleData.body,
            tagList: tagList, // Use the updated tagList state
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // After publishing, navigate to the article detail page
      navigate(`/article/${response.data.article.slug}`);

      // Reset form and tagList
      setArticleData({
        title: "",
        description: "",
        body: "",
        tags: "",
      });
      setTagList([]);
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form>
              <fieldset>
                <fieldset className="form-group">
                  <label htmlFor="title">Article Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    id="title"
                    value={articleData.title}
                    onChange={handleInputChange}
                    style={{fontSize:'16px'}}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    id="description"
                    value={articleData.description}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="body">Article Body</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    name="body"
                    id="body"
                    value={articleData.body}
                    onChange={handleInputChange}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags and press Enter"
                    name="tags"
                    id="tags"
                    value={articleData.tags}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </fieldset>
                <div className="tag-list mt-1">
                  {tagList.map((tag, index) => (
                    <span key={index} className="tag-default tag-pill">
                      <i className="bi bi-x" onClick={() => removeTag(tag)}></i>
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-lg btn-success btn-primary ml-auto float-end"
                  type="button"
                  onClick={handlePublishArticle}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create_Articles;
