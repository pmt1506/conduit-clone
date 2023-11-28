import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
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
  const [totalArticles, setTotalArticles] = useState(0);

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
        let apiUrl = "https://api.realworld.io/api/articles";
  
        // if (currentTab === "Global Feed") {
        //   apiUrl += `?${selectedTag ? `tag=${selectedTag}&` : ""}limit=10&offset=${(currentPage - 1) * 10}`;
        // } else if (currentTab === "Your Feed" && user) {
        //   apiUrl = `https://api.realworld.io/api/articles/feed?limit=10&offset=${(currentPage - 1) * 10}`;
        // }

        if (currentTab === "Global Feed") {
          apiUrl += `?${selectedTag ? `tag=${selectedTag}&` : ""}limit=10&offset=${(currentPage - 1) * 10}`;
        } else if (currentTab === "Your Feed" && user) {
          const userToken = localStorage.getItem("userToken");
          apiUrl = `https://api.realworld.io/api/articles/feed?limit=10&offset=${(currentPage - 1) * 10}`;
          
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          console.log("Fetched Your Feed Articles:", response.data.articles);

          // Update total articles for Your Feed based on the response
          setTotalArticles(response.data.articlesCount);

          // Set the articles for Your Feed
          setArticles(response.data.articles);
        }
  
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched Articles:", data.articles);
  
        // Update total articles based on the response
        if (currentTab === "Global Feed") {
          setTotalArticles(data.articlesCount);
        }
  
        setArticles(data.articles);
      } catch (error) {
        console.error(`Error fetching articles for tab ${selectedTag}:`, error);
      } finally {
        setLoadingArticles(false);
      }
    };
  
    // If the current tab is "Your Feed," set the current tab to "Global Feed" when the selected tag changes
    if (currentTab === "Your Feed" && selectedTag) {
      setCurrentTab("Global Feed");
    }
  
    fetchArticles();
  }, [selectedTag, currentTab, currentPage, user]);

  const totalPages = Math.ceil(totalArticles / 10);
  console.log("Total Pages:", totalPages);

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
  const currentArticles = articles ? articles.slice(startIndex, endIndex) : [];

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
