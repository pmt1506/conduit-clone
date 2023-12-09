import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners"; // Import the loader component
import toast from "react-hot-toast";

const Edit_Articles = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    body: "",
    tags: "",
  });

  const [tagList, setTagList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );

        const article = response.data.article;

        setArticleData({
          title: article.title,
          description: article.description,
          body: article.body,
          tags: "",
        });

        setTagList(article.tagList);
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && articleData.tags.trim() !== "") {
      e.preventDefault();

      if (!tagList.includes(articleData.tags.trim())) {
        setTagList((prevTagList) => [...prevTagList, articleData.tags.trim()]);
      }

      setArticleData((prevData) => ({ ...prevData, tags: "" }));
    }
  };

  const removeTag = (tagToRemove) => {
    setTagList((prevTagList) =>
      prevTagList.filter((tag) => tag !== tagToRemove)
    );
  };

  const handlePublishArticle = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      const updatedArticle = {
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
        tagList: tagList,
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

      const newSlug = response.data.article.slug;
      navigate(`/article/${newSlug}`);

      // Show success toast
      toast.success("Article updated successfully!");
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  return (
    <div className="editor-page">
      {loading ? (
        <div className="loading-spinner">
          <PuffLoader color={"#36D7B7"} loading={loading} size={150} />
        </div>
      ) : (
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
                      value={articleData.title}
                      onChange={handleInputChange}
                      style={{ fontSize: "16px" }}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <label htmlFor="description">Description</label>
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
                    <label htmlFor="body">Article Body</label>
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
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags and press Enter"
                      name="tags"
                      value={articleData.tags}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="tag-list mt-1">
                      {tagList.map((tag, index) => (
                        <span key={index} className="tag-default tag-pill">
                          <i
                            className="bi bi-x"
                            onClick={() => removeTag(tag)}
                          ></i>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    className="btn btn-lg btn-success btn-primary ml-auto float-end"
                    type="button"
                    onClick={handlePublishArticle}
                  >
                    Update Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit_Articles;
