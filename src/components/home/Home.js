import React, { useState, useEffect } from "react";
import GlobalFeed from "./GlobalFeed";
import YourFeed from "./YourFeed";
import Pagination from "./Pagination";
import Tags from "./Tags";
import "../../css/Home.css";

const Home = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const articlesPerPage = 10;

  useEffect(() => {
    // Fetch tags only once when the component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch("https://api.realworld.io/api/tags");
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();

    document.title = 'Home -- Conduit';
  }, []);

  useEffect(() => {
    // Fetch articles when selectedTag changes
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await fetch(
          `https://api.realworld.io/api/articles?limit=197${
            selectedTag ? `&tag=${selectedTag}` : ""
          }`
        );
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error(`Error fetching articles for tag ${selectedTag}:`, error);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, [selectedTag]);

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handleTagClick = (tag) => {
    console.log("Selected Tag:", tag);
    setCurrentPage(1);
    setSelectedTag(tag);
  };

  return (
    <div>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${!selectedTag ? "active" : ""}`}
                      href=""
                      onClick={() => setSelectedTag(null)}
                      style={{ color: "#aaa" }}
                    >
                      Global Feed
                    </a>
                  </li>
                  {selectedTag && (
                    <li className="nav-item">
                      <a className="nav-link active" href="">
                        #{selectedTag}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <GlobalFeed
                articles={currentArticles}
                loading={loadingArticles}
              />

              {!loadingArticles && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                />
              )}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <Tags
                  tags={tags}
                  loading={loadingTags}
                  onTagClick={handleTagClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
