import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

const Create_Articles = ({ onUpdateArticles }) => {
  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    body: "",
    tags: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prevData) => ({ ...prevData, [name]: value }));
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
            tagList: articleData.tags.split(",").map(tag => tag.trim()),
          },
        }
        // You may need to include authentication headers if required
      );

      // Notify parent component (GlobalFeed) about the new article
      onUpdateArticles(response.data.article);
      
      // Reset form data
      setArticleData({
        title: "",
        description: "",
        body: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages"></ul>
            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={articleData.title}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={articleData.description}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={articleData.body}
                    onChange={handleInputChange}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    name="tags"
                    value={articleData.tags}
                    onChange={handleInputChange}
                  />
                  <div className="tag-list"></div>
                </fieldset>
                <button
                  className="btn btn-lg btn-success ml-auto"
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
