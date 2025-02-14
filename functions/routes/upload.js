import { Router } from "express";
import { auth, db, userRef, storage, videoRef } from "../firebase-admin.js";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);

router.post("/api/uploadVideo", upload, async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log("Uploading video for user:", userId);
   
    const userData= await userRef.doc(userId).get();
    const userSnap=userData.data()
    const creator=userSnap.username;
    console.log(creator)
    if (!req.files || !req.files.video) return res.status(400).json({ error: "No video file uploaded" });

    const bucket = storage.bucket("clinikk-b434d.firebasestorage.app"); 

   
    const videoFile = req.files.video[0];
    const videoFileName = `Videos/${userId}_${Date.now()}_${videoFile.originalname}`;
    const videoFileRef = bucket.file(videoFileName);

    const uploadVideoStream = videoFileRef.createWriteStream({
      metadata: { contentType: videoFile.mimetype },
      resumable: true,
    });

    uploadVideoStream.end(videoFile.buffer);

 
    uploadVideoStream.on("error", async (error) => {
      console.error(" Video upload failed due to network issue:", error);
      return res.status(500).json({ error: "Network issue detected. Please retry upload." });
    });

    uploadVideoStream.on("finish", async () => {
      const [videoURL] = await videoFileRef.getSignedUrl({ action: "read", expires: "01-01-2030" });

      
      let thumbnailURL = "";
      if (req.files.thumbnail) {
        const thumbnailFile = req.files.thumbnail[0];
        const thumbnailFileName = `Thumbnails/${userId}_${Date.now()}_${thumbnailFile.originalname}`;
        const thumbnailFileRef = bucket.file(thumbnailFileName);

        const uploadThumbnailStream = thumbnailFileRef.createWriteStream({
          metadata: { contentType: thumbnailFile.mimetype },
          resumable: true,
        });

        uploadThumbnailStream.end(thumbnailFile.buffer);

        uploadThumbnailStream.on("error", async (error) => {
          console.error("Thumbnail upload failed:", error);
        });

        uploadThumbnailStream.on("finish", async () => {
          const [thumbnailSignedURL] = await thumbnailFileRef.getSignedUrl({ action: "read", expires: "01-01-2030" });
          thumbnailURL = thumbnailSignedURL;

       
          const videoData = {
            userId,
            name: req.body.name || "Untitled",
            bio: req.body.bio || "",
            videoURL,
            thumbnailURL, 
            size: videoFile.size,
            uploadedAt: new Date(),
            like:0,
            creator:creator
          };

          const userVideosRef = userRef.doc(userId).collection("videos");
          const videoDoc = await userVideosRef.add(videoData);
          await videoRef.add(videoData);

          return res.status(200).json({ message: "Video uploaded successfully", videoId: videoDoc.id, videoURL, thumbnailURL });
        });
      } else {

        const videoData = {
          userId,
          name: req.body.name || "Untitled",
          bio: req.body.bio || "",
          videoURL,
          thumbnailURL: "", 
          size: videoFile.size,
          uploadedAt: new Date(),
          like:0,
        };

        const userVideosRef = userRef.doc(userId).collection("videos");
        const videoDoc = await userVideosRef.add(videoData);
        await videoRef.add(videoData);

        return res.status(200).json({ message: "Video uploaded successfully", videoId: videoDoc.id, videoURL, thumbnailURL });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to upload video and thumbnail." });
  }
});

export default router;
