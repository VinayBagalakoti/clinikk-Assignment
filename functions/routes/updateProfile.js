import { Router } from "express";
import { userRef, auth } from "../firebase-admin.js"; 

const router = Router();

router.post("/api/profileUpdate", async (req, res) => {
    try {
        const { token, username
            , bio } = req.body; 

        if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

     
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        console.log("Updating profile for user:", userId);

      
        

   
        await userRef.doc(userId).set(
            {
                ...(username && { username }), 
                ...(bio && { bio })          
            }
        );

        return res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
