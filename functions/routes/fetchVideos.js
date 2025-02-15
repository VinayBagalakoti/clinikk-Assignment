import { Router } from "express";
import { videoRef } from "../firebase-admin.js";

const router = Router();

router.get("/api/fetchVideos", async (req, res) => {
    console.log("hello")
  try {
    const snapshot = await videoRef.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No videos found" });
    }

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      videoURL: doc.data().videoURL, 
      thumbnailURL: doc.data().thumbnailURL, 
      name: doc.data().name,
      uploadedAt: doc.data().uploadedAt,
      creator:doc.data().creator,
      bio:doc.data
    }));

    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
});

export default router;
