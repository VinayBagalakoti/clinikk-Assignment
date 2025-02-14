import { Router } from "express";
import { userRef, auth } from "../firebase-admin.js"; // ✅ Import Firestore & Firebase Auth

const router = Router();

router.post("/api/profileUpdate", async (req, res) => {
    try {
        const { token, username
            , bio } = req.body; // ✅ Get user details & token from request body

        if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

        // ✅ Verify Firebase Auth Token
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        console.log("Updating profile for user:", userId);

        // ✅ Validate required fields
        

        // ✅ Update Firestore user profile
        await userRef.doc(userId).set(
            {
                ...(username && { username }),  // ✅ Update only if username is provided
                ...(bio && { bio })            // ✅ Update only if bio is provided
            }
        );

        return res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
