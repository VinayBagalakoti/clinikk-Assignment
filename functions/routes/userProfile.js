import { Router } from "express";
import { userRef } from "../firebase-admin.js"; // ✅ Import Firestore

const router = Router();

// ✅ Fix the route URL format (`/:id` instead of `:id`)
router.get("/api/userProfile/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("hello  ",userId)
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        console.log("Fetching profile for user:", userId);

        // ✅ Fetch User Profile from Firestore
        const userDoc = await userRef.doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found in Firestore" });
        }

        // ✅ Extract User Data
        const userData = userDoc.data();
        const videosSnapshot = await userRef.doc(userId).collection("videos").get();
        const videos = videosSnapshot.docs.map(doc => ({
            id: doc.id,
            videoURL: doc.data().videoURL,
            thumbnailURL: doc.data().thumbnailURL,
        }));
        return res.status(200).json({
            name: userData.username || "No Name",
            email: userData.email || "No Email",
            bio: userData.bio || "No Bio",
            videos:videos || [],
            followers: userData.followers || 0,
            following: userData.following || 0,
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


export default router;