import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Edit_Articles = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    body: "",
    tags: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data

        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );

        const article = response.data.article;

        setArticleData({
          title: article.title,
          description: article.description,
          body: article.body,
          tags: article.tagList.join(", "),
        });
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchArticleData();
  }, [slug]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setArticleData({
      ...articleData,
      [name]: value,
    });
  };

  const handlePublishArticle = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      const updatedArticle = {
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
      };

      const response = await axios.put(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          article: updatedArticle,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Extract the new slug from the response
      const newSlug = response.data.article.slug;

      // Navigate to the new slug
      navigate(`/article/${newSlug}`);
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
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

export default Edit_Articles;
