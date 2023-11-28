// import React, { useState, useEffect } from "react";
// import GlobalFeed from "./GlobalFeed";
// import YourFeed from "./YourFeed";
// import Pagination from "./Pagination";
// import Tags from "./Tags";
// import "../../css/Home.css";

// const Home = () => {
//   const [tags, setTags] = useState([]);
//   const [articles, setArticles] = useState([]);
//   const [loadingTags, setLoadingTags] = useState(true);
//   const [loadingArticles, setLoadingArticles] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedTag, setSelectedTag] = useState(null);
//   const articlesPerPage = 10;

//   useEffect(() => {
//     document.title = "Home -- Conduit";
//     // Fetch tags only once when the component mounts
//     const fetchTags = async () => {
//       try {
//         const response = await fetch("https://api.realworld.io/api/tags");
//         const data = await response.json();
//         setTags(data.tags);
//       } catch (error) {
//         console.error("Error fetching tags:", error);
//       } finally {
//         setLoadingTags(false);
//       }
//     };
//     fetchTags();
//   }, []);

//   useEffect(() => {
//     // Fetch articles when selectedTag changes
//     const fetchArticles = async () => {
//       try {
//         setLoadingArticles(true);
//         const response = await fetch(
//           `https://api.realworld.io/api/articles?limit=197${selectedTag ? `&tag=${selectedTag}` : ""
//           }`
//         );
//         const data = await response.json();
//         setArticles(data.articles);
//       } catch (error) {
//         console.error(`Error fetching articles for tag ${selectedTag}:`, error);
//       } finally {
//         setLoadingArticles(false);
//       }
//     };
//     fetchArticles();
//   }, [selectedTag]);

//   const totalArticles = articles.length;
//   const totalPages = Math.ceil(totalArticles / articlesPerPage);

//   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const startIndex = (currentPage - 1) * articlesPerPage;
//   const endIndex = startIndex + articlesPerPage;
//   const currentArticles = articles.slice(startIndex, endIndex);

//   const handleTagClick = (tag) => {
//     console.log("Selected Tag:", tag);
//     setCurrentPage(1);
//     setSelectedTag(tag);
//   };

//   return (
//     <div>
//       <div className="home-page">
//         <div className="banner">
//           <div className="container">
//             <h1 className="logo-font">conduit</h1>
//             <p>A place to share your knowledge.</p>
//           </div>
//         </div>

//         <div className="container page">
//           <div className="row">
//             <div className="col-md-9">
//               <div className="feed-toggle">
//                 <ul className="nav nav-pills outline-active">
//                   <li className="nav-item">
//                     <a
//                       className={`nav-link ${selectedTag === "Your Feed" ? "active" : ""}`}
//                       href=""
//                       onClick={() => {
//                         setSelectedTag("Your Feed");
//                         // You may want to fetch and load the user's feed here
//                       }}
//                     >
//                       Your Feed
//                     </a>
//                   </li>
//                   {selectedTag === "Your Feed" && (
//                     <YourFeed articles={currentArticles} loading={loadingArticles} />
//                   )}
//                   <li className="nav-item">
//                     <a
//                       className={`nav-link ${!selectedTag ? "active" : ""}`}
//                       href=""
//                       onClick={() => setSelectedTag(null)}
//                       style={{ color: "#aaa" }}
//                     >
//                       Global Feed
//                     </a>
//                   </li>
//                   {selectedTag && (
//                     <li className="nav-item">
//                       <a className="nav-link active" href="">
//                         #{selectedTag}
//                       </a>
//                     </li>
//                   )}
//                 </ul>
//               </div>

//               <GlobalFeed
//                 articles={currentArticles}
//                 loading={loadingArticles}
//               />

//               {!loadingArticles && totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   handlePageChange={handlePageChange}
//                   goToPreviousPage={goToPreviousPage}
//                   goToNextPage={goToNextPage}
//                 />
//               )}
//             </div>

//             <div className="col-md-3">
//               <div className="sidebar">
//                 <p>Popular Tags</p>
//                 <Tags
//                   tags={tags}
//                   loading={loadingTags}
//                   onTagClick={handleTagClick}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

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

    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await fetch(
          `https://api.realworld.io/api/articles?limit=197${selectedTag ? `&tag=${selectedTag}` : ""}`
        );
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error(`Error fetching articles for tag ${selectedTag}:`, error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchUser();
    fetchTags();
    fetchArticles();
  }, [selectedTag]);

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

  // fix loading page when change feed
  const handleYourFeedClick = (e) => {
    e.preventDefault();
    setCurrentTab("Your Feed");
    setSelectedTag(null);
  };

  const handleGlobalFeedClick = () => {
    setCurrentTab("Global Feed");
    setSelectedTag(null);
  };
  //

  const handleTagClick = (tag) => {
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

              {/* {currentTab === "Your Feed" && user && (
                <YourFeed
                  articles={currentTab === "Your Feed" ? currentArticles : []}
                  loading={loadingArticles}
                />
              )} */}

              {currentTab !== "Your Feed" && (
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
