
import axios from 'axios';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import './App.css'
import Layout from './Layout/Layout';
import Home from './Pages/Home';

function App() {




  const fetchVideoDetails = async (videoId) => {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,contentDetails,statistics", // Metadata, details, and statistics
          id: videoId, // ID of the video
          key: API_KEY,
        },
      });
      console.log(response.data.items[0]); // Logs the video details
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  // Example usage
  // fetchVideoDetails("dQw4w9WgXcQ"); // Replace with a valid YouTube video ID


  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
    </Routes>
  )
}

export default App
