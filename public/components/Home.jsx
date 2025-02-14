
import React, { useState, useEffect } from "react";
import "../styles/home.css";
import API_URL from "../config";

const Home = () => {
  const [videos, setVideos] = useState([]); 
  const [filteredVideos, setFilteredVideos] = useState([]); 
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filter, setFilter] = useState("");
  
  // fetch the videos from the backend
  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fetchVideos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await res.json();
      console.log("Fetched Videos:", data.videos); 

      setVideos(data.videos); 
      setFilteredVideos(data.videos); 
    } catch (e) { 
      console.error("Error fetching videos:", e);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Search Handler
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter((video) =>
      video.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.creator?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

 // filter handler 
  useEffect(() => {
    let updatedVideos = [...videos];

    if (filter === "recent") {
      updatedVideos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    } else if (filter) {
      updatedVideos = videos.filter((video) => video.creator === filter);
    } else {
      updatedVideos = [...videos]; 
    }

    setFilteredVideos(updatedVideos);
  }, [filter, videos]);

  return (
    <div className="home-container">
      <h2>Video Gallery</h2>
     
      <input
        type="text"
        placeholder="Search by name, bio, or creator..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

     
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
        <option value="">Original Order</option>
        <option value="recent">Recently Uploaded</option>
        {Array.from(new Set(videos.map((video) => video.creator))).map((creator) => (
          <option key={creator} value={creator}>{creator}</option>
        ))}
      </select>

  
      <div className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card" onClick={() => setSelectedVideo(video.videoURL)}>
              <img src={video.thumbnailURL} alt={video.name} className="video-thumbnail" />
              <div className="video-info">
                <h3>{video.name}</h3>
                <p><strong>By:</strong> {video.creator || "Unknown"}</p>
                <p><strong>Description:</strong> {video.bio || "No Description"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>

      {selectedVideo && (
        <div className="video-player-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-player">
            <video controls autoPlay>
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

