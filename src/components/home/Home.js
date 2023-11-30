import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import GlobalFeed from "./GlobalFeed";
import YourFeed from "./YourFeed";
import Tags from "./Tags";
import "../../css/Home.css";

const Home = () => {
  const userToken = localStorage.getItem("userToken");

  const [feedStatus, setFeedStatus] = useState(userToken ? "your" : "global");
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
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
  }, [selectedTag]);

  const handleTagClick = (tag) => {
    console.log("Selected Tag:", tag);
    setSelectedTag(tag);
  };

  const handleFeedStatusChange = (newFeedStatus) => {
    setFeedStatus(newFeedStatus);
    setSelectedTag(null); // Reset selected tag when changing feed status
  };

  return (
    <div>
      <div className="home-page">
        {!userToken && (
          <div className="banner">
            <div className="container">
              <h1 className="logo-font">conduit</h1>
              <p>A place to share your knowledge.</p>
            </div>
          </div>
        )}

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
                    {userToken && (
                      <div
                        className={`nav-link ${
                          !selectedTag && feedStatus === "your" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer", color: "#555" }}
                        onClick={() => handleFeedStatusChange("your")}
                      >
                        Your Feed
                      </div>
                    )}
                  </li>
                  <li className="nav-item">
                    <div
                      className={`nav-link ${
                        (!selectedTag && feedStatus !== "your") || !userToken
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedTag(null);
                        handleFeedStatusChange("global");
                      }}
                      style={{ color: "#555", cursor: "pointer" }}
                    >
                      Global Feed
                    </div>
                  </li>
                  {selectedTag && (
                    <li className="nav-item">
                      <div
                        className="nav-link active"
                        style={{ cursor: "pointer" }}
                      >
                        #{selectedTag}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {feedStatus === "your" ? (
                selectedTag !== null ? (
                  <GlobalFeed
                    articles={articles}
                    loading={loadingArticles}
                    selectedTag={selectedTag}
                  />
                ) : (
                  <YourFeed loading={loadingArticles} />
                )
              ) : (
                <GlobalFeed
                  articles={articles}
                  loading={loadingArticles}
                  selectedTag={selectedTag}
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
