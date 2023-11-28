import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("Global Feed");

  useEffect(() => {
    document.title = "Home -- Conduit";

    const fetchUser = async () => {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        try {
          const response = await fetch("https://api.realworld.io/api/user", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          const userData = await response.json();
          setUser(userData.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

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

    fetchUser();
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        setArticles([]);
        // Only fetch articles for the selected tag if the current tab is "Global Feed"
        if (currentTab === "Global Feed") {
          const response = await fetch(
            `https://api.realworld.io/api/articles?limit=197${selectedTag ? `&tag=${selectedTag}` : ""}`
          );
          const data = await response.json();
          console.log("Fetched Articles:", data.articles);
          setArticles(data.articles);
        }
      } catch (error) {
        console.error(`Error fetching articles for tag ${selectedTag}:`, error);
      } finally {
        setLoadingArticles(false);
      }
    };
  
    // If the current tab is "Your Feed," set the current tab to "Global Feed" when the selected tag changes
    if (currentTab === "Your Feed" && selectedTag) {
      setCurrentTab("Global Feed");
    }
  
    fetchArticles();
  }, [selectedTag, currentTab]);
  

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / 10);

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

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handleYourFeedClick = (e) => {
    e.preventDefault();
    setCurrentTab("Your Feed");
    setSelectedTag(null);
  };

  const handleGlobalFeedClick = () => {
    setCurrentTab("Global Feed");
    setSelectedTag(null);
  };

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
                  {user && (
                    <li className="nav-item">
                      <NavLink
                        to="/yourfeed"
                        className={`nav-link ${currentTab === "Your Feed" ? "active" : ""}`}
                        onClick={handleYourFeedClick}
                        end
                      >
                        Your Feed
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className={`nav-link ${!selectedTag || currentTab === "Global Feed" ? "active" : ""}`}
                      onClick={handleGlobalFeedClick}
                      end
                    >
                      Global Feed
                    </NavLink>
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

              {!loadingArticles && currentTab === "Your Feed" && user && (
                <YourFeed
                  articles={currentTab === "Your Feed" ? currentArticles : []}
                  loading={loadingArticles}
                />
              )}

              {!loadingArticles && (
                <GlobalFeed articles={currentArticles} loading={loadingArticles} />
              )}

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
                <Tags tags={tags} loading={loadingTags} onTagClick={handleTagClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
