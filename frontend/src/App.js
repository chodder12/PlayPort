import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import News from './pages/News';
import Profile from './pages/Profile';

const GamingNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch gaming news from the backend
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/gaming-news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching the gaming news:', error);
      }
    };
    fetchNews();
  }, []); // Empty dependency array ensures it runs once when component mounts.

  return (
    <div>
      <h1>Play Port</h1>
      {news.length > 0 ? (
        <ul>
          {news.map((item, index) => (
            <li key={index}>{item.title}</li> // Modify according to the structure of the data
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

function App() {
  const renderPage = () => {
    const path = window.location.pathname;
    if (path === '/news') return <News />;
    if (path === '/profile') return <Profile />;
    return <Home />;
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>
      <main>
        {/* Render the GamingNews component */}
        <GamingNews />
        
        {/* Render the specific page content */}
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
