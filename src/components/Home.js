import React, { useState, useEffect } from "react";

const Home = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10; // Number of articles per page

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDataCallback(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        setLoading(false);
      }
    };

    fetchData("https://api.realworld.io/api/tags", (data) => setTags(data.tags));
    fetchData("https://api.realworld.io/api/articles?limit=197", (data) => setArticles(data.articles));
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
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Your Feed
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="">
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>

              {currentArticles.map((article) => (
                <div key={article.slug} className="article-preview">
                  <div className="article-meta">
                    <a href="">
                      <img src={article.author.image} alt={article.author.username} />
                    </a>
                    <div className="info">
                      <a href="" className="author">
                        {article.author.username}
                      </a>
                      <span className="date">{article.createdAt}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                  <a href={`/article/${article.slug}`} className="preview-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map((tag) => (
                        <li key={tag} className="tag-default tag-pill tag-outline">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))}

              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={goToPreviousPage}>
                    {"<"}
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={goToNextPage}>
                    {">"}
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  {loading ? (
                    <div>Loading tags...</div>
                  ) : (
                    tags.map((tag) => (
                      <a key={tag} href={`#${tag}`} className="tag-default tag-pill">
                        {tag} -
                      </a>
                    ))
                  )}
                </div>
                {/* <div className="post-preview">No tags are here... yet.</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
