import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import { auth } from "../firebase.js";
import API_URL from "../config";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("your.email@example.com");
  const [bio, setBio] = useState("Write something about yourself...");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [editing, setEditing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // fetch user details from the backend
  const fetchUserProfile = async (uid) => {
    try {
      const response = await fetch(`${API_URL}/api/userProfile/${uid}`);
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data);
        return;
      }
      console.log("Fetched Data:", data);
      setName(data.name);
      setBio(data.bio);
      setEmail(data.email);
      setVideos(data.videos || []);
    } catch (e) {
      console.log("Error fetching profile:", e);
    }
  };

  //  handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser.uid);
      } else {
        toast.error("User not found");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-section">
        <label>
          <img
            src={profilePic || "/default-profile.png"}
            alt="Profile"
            className="profile-pic"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProfilePic(URL.createObjectURL(e.target.files[0]))
            }
          />
        </label>
        <button>Upload Profile Picture</button>
      </div>
      
      {/* edit profilr and profile display of the user */}
      <div className="info-section">
        {editing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            <button onClick={() => setEditing(false)}>Save</button>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Bio:</strong> {bio}
            </p>
            <p>
              <strong>Followers:</strong> {followers}
            </p>
            <p>
              <strong>Following:</strong> {following}
            </p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>


{/* videos uploaded by the user */}
      <div className="videos-section">
        <h3>My Uploaded Videos</h3>
        <div className="video-grid">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => setSelectedVideo(video.videoURL)}
              >
                <img
                  src={video.thumbnailURL}
                  alt={video.name}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h3>{video.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>No videos uploaded yet.</p>
          )}
        </div>
      </div>

{/* video player */}
      {selectedVideo && (
        <div
          className="video-player-overlay"
          onClick={() => setSelectedVideo(null)}
        >
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

export default Profile;
