
import axios from 'axios';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import './App.css'
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import VideoPage from './Pages/VideoPage';

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

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path="/video/:id" element={<VideoPage />} />
    </Routes>
  )
}

export default App
