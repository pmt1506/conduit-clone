import React, { useState, useEffect } from 'react';
import GlobalFeed from './GlobalFeed';
import YourFeed from './YourFeed';
import Pagination from './Pagination';
import Tags from './Tags';

const Home = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDataCallback(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await fetchData("https://api.realworld.io/api/tags", (data) => setTags(data.tags));
      await fetchData("https://api.realworld.io/api/articles?limit=197", (data) => setArticles(data.articles));
    };

    fetchAllData();
  }, []);

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

  return (
    <div>
      <div className="home-page container">
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
                  {/* <li className="nav-item">
                    <a className="nav-link" href="">
                      Your Feed
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a className="nav-link active" href="">
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>

              {/* Adjusted the condition after login here */}

              {/* <YourFeed articles={currentArticles} /> */}

              <GlobalFeed articles={currentArticles} loading={loading} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <Tags tags={tags} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
