import React, { useState, useEffect } from "react";
import "../styles/upload.css";
import { toast } from "react-toastify";
import API_URL from "../config";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_AUDIO_SIZE = 20 * 1024 * 1024;
const MIN_VIDEO_DURATION = 5;
const MIN_AUDIO_DURATION = 10;

const Upload = () => {
  const [showAudio, setShowAudio] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [videoBio, setVideoBio] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  // Check authentication status & persist user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handles video file selection & validation
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setVideoError("Error: Video file size exceeds 50MB!");
      return;
    }
    // Check video duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration < MIN_VIDEO_DURATION) {
        setVideoError("Error: Video must be at least 5 minutes long!");
        setVideoFile(null);
      } else {
        setVideoError("");
        setVideoFile(file);
      }
    };
  };

  // Resets form fields after successful upload
  const resetForm = () => {
    setVideoFile(null);
    setVideoName("");
    setVideoBio("");
    setVideoThumbnail(null);
    setVideoError("");
    setUploading(false);
  };

  //  Handles video upload to backend
  const handleVideoSubmit = async () => {
    if (!videoFile || !videoThumbnail) {
      toast.error("Please upload a video file and thumbnail!");
      return;
    }

    try {
      setUploading(true);
      if (!user) {
        toast.error("Please log in first");
        return;
      }

      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("thumbnail", videoThumbnail);
      formData.append(
        "name",
        videoName.trim() !== "" ? videoName : "Untitled Video"
      );
      formData.append(
        "bio",
        videoBio.trim() !== "" ? videoBio : "No description provided."
      );
      formData.append("token", token);

      //  Send video data to backend
      const res = await fetch(`${API_URL}/api/uploadVideo`, {
        method: "POST",
        body: formData,
      });

      const response = await res.json();
      if (!res.ok) {
        toast.error(response.error || "Failed to upload the video");
      } else {
        toast.success("Video uploaded successfully!");
        resetForm();
      }
    } catch (e) {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="upload-container">
      <h2>Upload Your Content</h2>

      {!showAudio ? (
        <div className="upload-section">
          <h3>Upload Video</h3>
          <label>Video Name</label>
          <input
            type="text"
            placeholder="Enter video name"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
          <label>Video Bio</label>
          <textarea
            placeholder="Enter video bio"
            value={videoBio}
            onChange={(e) => setVideoBio(e.target.value)}
          />
          <label>Upload Video Thumbnail Here</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setVideoThumbnail(e.target.files[0])}
          />
          <label>Upload Video Here</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {videoError && <p className="error">{videoError}</p>}

          <button
            onClick={handleVideoSubmit}
            disabled={!videoFile || videoError || uploading}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

          <button className="switch-btn" onClick={() => setShowAudio(true)}>
            Switch to Audio Upload
          </button>
        </div>
      ) : (
        <div className="upload-section">
          <h3>Upload Audio</h3>
          <label>Audio Name</label>
          <input
            type="text"
            placeholder="Enter audio name"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
          />
          <label>Audio Bio</label>
          <textarea
            placeholder="Enter audio bio"
            value={audioBio}
            onChange={(e) => setAudioBio(e.target.value)}
          />
          <label>Upload Audio Thumbnail Here</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAudioThumbnail(e.target.files[0])}
          />
          <button className="switch-btn" onClick={() => setShowAudio(false)}>
            Switch to Video Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
